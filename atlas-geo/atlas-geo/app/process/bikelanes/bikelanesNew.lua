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
  "osm_url",
  "updated_by",
  "update_at",
  "version"
})


local footwayProjection = {
  highway = "footway",
  tag = 'sidewalk'
}

local cyclewayProjection = {
  highway = "cycleway",
  tag = "cycleway"
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

local function timeValidation(tags)
    -- Presence of data
    tags.is_present = tags.category ~= nil
    -- Freshness of data, see documentation
    local withinYears = CheckDataWithinYears(tags["check_date:cycleway"], 2)
    tags.is_fresh = withinYears.result
    tags.fresh_age_days = withinYears.diffDays
end

local function normalizeTags(tags)
  FilterTags(tags, allowed_tags)
  timeValidation(tags)
  return tags
end

local function intoSkipList(object)
  -- normalizeTags(object.tags)
  skipTable:insert({
    tags = object.tags,
    geom = object:as_linestring()
  })
end

-- projects all tags prefix:subtag=val -> subtag=val
local function projectTags(tags, prefix)
  local projectedTags = {}
  for prefixedKey,val  in pairs(tags) do
    if prefixedKey ~= prefix and StartsWith(prefixedKey, prefix) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key = string.sub(prefixedKey, string.len(prefix) + 2)
      projectedTags[key] = val
    end
  end
  return projectedTags
end

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses

  -- Skip `highway=steps`
  -- We don't look at ramps on steps ATM. That is not good bicycleInfrastructure anyways
  allowed_values["steps"] = nil
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_values[object.tags.highway] then return end

  AddMetadata(object);
  AddUrl("way", object)

  AddSkipInfoToHighways(object)  if object.tags._skip == true then
    intoSkipList(object)
    return
  end

  -- apply predicates
  if BikelaneCategory(object.tags) then
    object.tags._skipNotes = nil
    table:insert({
      tags =  normalizeTags(object.tags),
      geom = object:as_linestring()
    })
    return
  end

  -- apply predicates nested
  local projections = { footwayProjection, cyclewayProjection }

  local projDirections = {
    [":right"] = { -1 },
    [":left"] = { 1 },
    [":both"] = { -1, 1 },
    [""] = { -1, 1 } -- TODO: if oneway=yes only apply to the right=-1
  }

  for _, projection in pairs(projections) do
    -- NOTE: the category/projection could also influence the offset e.g. a street with bike lane should have less offset than a sidewalk with bicycle=yes approx. the width of the bike lane itself
    local offset = roadWidth(object.tags) / 2
    for dir, signs in pairs(projDirections) do
      local tag = projection.tag .. dir
      if object.tags[tag] ~= "no" then
        local cycleway = projectTags(object.tags, tag)
        cycleway["highway"] = projection.highway
        cycleway[projection.tag] = object.tags[tag]
        if BikelaneCategory(cycleway) then
          cycleway._centerline = "generated from centerline with tag=" .. tag
          for key, val in pairs(object.tags) do
            if cycleway[key] == nil then cycleway[key]=val end
          end
          for _, sign in pairs(signs) do
            translateTable:insert({
              tags = normalizeTags(cycleway),
              geom = object:as_linestring(),
              offset = sign * offset
            })
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

