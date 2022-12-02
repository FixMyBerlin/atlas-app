package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")
require("HighwayClasses")
require("AddSkipInfoToHighways")
require("AddSkipInfoByWidth")
require("CheckDataWithinYears")
require("StartsWith")
require("categories")

local table = osm2pgsql.define_table({
  name = 'bikelanesNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local translateTable = osm2pgsql.define_table({
  name = 'bikelanesCenterlineNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type = 'real' }
  }
})


local skipTable = osm2pgsql.define_table({
  name = 'bikelanes_skipListNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

-- whitelist of tags we want to insert intro the DB
local allowed_tags = Set({
  "_centerline",
  "_skip",
  "_skipNotes",
  "_direction",
  "_offset",
  "access",
  "bicycle_road",
  "bicycle",
  "category",
  "cycleway:both",
  "cycleway:left",
  "cycleway:right",
  "cycleway",
  "foot",
  "footway",
  "highway",
  "is_sidepath",
  "mtb:scale",
  "name",
  "segregated",
  "sidewalk:both:bicycle",
  "sidewalk:left:bicycle",
  "sidewalk:right:bicycle",
  "traffic_sign",
  "width", -- experimental
  "sidewalk:width", -- experimental
  "cycleway:width", -- experimental
  "surface",
  "smoothness",
  "traffic_sign",
})


local footwayProjection = {
  highway = "footway",
  dest = "bicycle",
  tags = {
    ["sidewalk:left:bicycle"] = { 1 },
    ["sidewalk:right:bicycle"] = { -1 },
    ["sidewalk:both:bicycle"] = { -1, 1 },
    ["sidewalk:bicycle"] = { -1, 1 },
  },
}

local cyclewayProjection = {
  highway = "cycleway",
  dest = "cycleway",
  tags = {
    ["cycleway:left"] = { 1 },
    ["cycleway:right"] = { -1 },
    ["cycleway:both"] = { -1, 1 },
    ["cycleway"] = { -1, 1 },
  },
}

local function roadWidth(tags)
  -- if tags["width"] ~= nil then
  --   return tonumber(string.gmatch(tags["width"], "[^%s;]+")())
  -- end
  -- if tags["est_width"] ~= nil then
  --   return tonumber(string.gmatch(tags["est_width"], "[^%s;]+")())
  -- end
  -- local streetWidths = {primary=10, secondary=8, tertiary=6, residential=6}
  -- if streetWidths[tags["highway"]] ~= nil then
  --   return streetWidths[tags["highway"]]
  -- end
  return 8
end

local function normalizeTags(object)
  FilterTags(object, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)
  -- Presence of data
  if (object.tags.category) then
    object.tags.is_present = true
  else
    object.tags.is_present = false
  end

  -- Freshness of data, see documentation
  local withinYears = CheckDataWithinYears(object.tags["check_date:cycleway"], 2)
  object.tags.is_fresh = withinYears.result
  object.tags.fresh_age_days = withinYears.diffDays
  return object.tags
end

local function intoSkipList(object)
  normalizeTags(object)
  skipTable:insert({
    tags = object.tags,
    geom = object:as_linestring()
  })
end

local function projectNestedTags(tags, prefix)
  local projectedTags = {}
  for key,val  in pairs(tags) do
    if key ~= prefix and StartsWith(key, prefix) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key_suffix = string.sub(key, string.len(prefix) + 2)
      projectedTags[key_suffix] = val
    end
  end
  return projectedTags
end

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_values[object.tags.highway] then return end


  AddSkipInfoToHighways(object)
  -- Skip `highway=steps`
  -- We don't look at ramps on steps ATM. That is not good bicycleInfrastructure anyways
  if object.tags.highway == "steps" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=steps`"
    object.tags._skip = true
  end
  if object.tags._skip == true then
    intoSkipList(object)
    return
  end


  -- apply predicates
  if BikelaneCategory(object.tags) then
    object.tags._skipNotes = nil
    normalizeTags(object)
    table:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
    return
  end

  -- -- this is only to stay consistent with the previous version
  -- if OldCenterline(object.tags) then
  --   object.tags._skipNotes = nil
  --   normalizeTags(object)
  --   table:insert({
  --     tags = object.tags,
  --     geom = object:as_linestring()
  --   })
  -- end

  -- apply predicates nested
  local projections = { footwayProjection, cyclewayProjection }

  for _, transformer in pairs(projections) do
    -- set the highway category
    local cycleway = { highway = transformer.highway }
    -- NOTE: the category/transformer should also influence the offset e.g. a street with bike lane should have less offset than a sidewalk with bicycle=yes approx. the width of the bike lane itself
    local offset = roadWidth(object.tags) / 2
    for tag, signs in pairs(transformer.tags) do
      if object.tags[tag] ~= nil and object.tags[tag] ~= "no" then
        -- sets the bicycle tag to the value of nested tags
        cycleway[transformer.dest] = object.tags[tag]
        if BikelaneCategory(cycleway) then
          object.tags._centerline = "tagged on centerline"
          for _, sign in pairs(signs) do
            -- projectNestedTags(object.tags, tag)
            object.tags._skipNotes = nil
            object.tags.category = cycleway.category
            normalizeTags(object)
            -- local id = object.id
            -- object.id = object.id .. ({[-1]="_left", [1]="_right"})[sign]
            translateTable:insert({
              tags = object.tags,
              geom = object:as_linestring(),
              offset = sign * offset
            })
            -- object.id = id
          end
        end
      end
    end
  end

  -- TODO SKIPLIST: For ZES, we skip "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts
  if object.tags.category == nil then
    intoSkipList(object)
  end
end

