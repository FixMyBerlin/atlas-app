package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")
require("HighwayClasses")
require("RoadWidth")
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
    { column  = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'linestring' },
  }
})

local translateTable = osm2pgsql.define_table({
  name = 'bikelanesCenterlineNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type = 'real' }
  }
})


local skipTable = osm2pgsql.define_table({
  name = 'bikelanes_skipListNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
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
  "cycleway",
  "foot",
  "footway",
  "highway",
  "is_sidepath",
  "mtb:scale",
  "name",
  "segregated",
  "traffic_sign",
  "width", -- experimental
  "surface",
  "smoothness",
  "traffic_sign",
})


local function timeValidation(tags)
    -- IMO this whole logic should be implemented on the database
    -- e.g. only safe the last date of modification and then define computated properties
    -- Presence of data
    tags.is_present = tags.category ~= nil
    -- Freshness of data, see documentation
    local withinYears = CheckDataWithinYears(tags["check_date:cycleway"], 2)
    tags.is_fresh = withinYears.result
    tags.fresh_age_days = withinYears.diffDays
end

-- local function normalizeTags(tags)
--   FilterTags(tags, allowed_tags)
--   timeValidation(tags)
--   return tags
-- end

local function intoSkipList(object)
  -- normalizeTags(object.tags)
  skipTable:insert({
    tags = object.tags,
    meta = Metadata(object),
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

  AddSkipInfoToHighways(object)

  if object.tags._skip == true then
    intoSkipList(object)
    return
  end

  -- apply predicates
  if BikelaneCategory(object.tags) then
    object.tags._skipNotes = nil
    FilterTags(object.tags, allowed_tags)
    table:insert({
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
    return
  end

  -- apply predicates nested
  -- for that we define "projections" as:
  -- `highway` is the new highway type for the generated object
  -- `prefix` will be concatinated wiht one of the sides `':left' | ':right' | ':both' | '' `
  -- all tags wich have the concatination as a preix get projected -> w\o prefix
  -- tagsCC is a list of tags which get copied from the parent object if they don't exist yet on the generated one
  local footwayProjection = {
    highway = "footway",
    prefix = "sidewalk",
  }
  local function laneSurface(cycleway, parent)
    -- TODO: check with category instead
    if cycleway.bicycle=='lane' then
      cycleway["surface"] = parent["surface"]
      cycleway["smoothness"] = parent["smoothness"]
    end
  end
  local function offsetLanes(cycleway)
  end

  local function cyclewayPP(cycleway, parent)
    laneSurface(cycleway, parent)
    offsetLanes(cycleway)
    return true
  end

  local cyclewayProjection = {
    highway = "cycleway",
    prefix = "cycleway",
    postProcessing = cyclewayPP,-- for cycleways on streets surface and smoothness should match
  }
  local projections = { footwayProjection, cyclewayProjection }

  local projSides = {
    [":right"] = { -1 },
    [":left"] = { 1 },
    [":both"] = { -1, 1 },
    [""] = { -1, 1 }
  }

  for _, projection in pairs(projections) do
    -- NOTE: the category/projection should also influence the offset
    -- e.g. a street with bike lane should have offset=streetWidth/2 - bikelaneWidth/2
    -- where a sidewalk with bicycle=yes should have offset=streetWidth/2 + bikelaneWidth/2
    local offset = RoadWidth(object.tags) / 2
    for side, signs in pairs(projSides) do
      local prefixedSide = projection.prefix .. side
      if object.tags[prefixedSide] ~= "no" and object.tags[prefixedSide] ~="separate" then
        local cycleway = projectTags(object.tags, prefixedSide)
        cycleway["highway"] = projection.highway
        cycleway["name"] = cycleway["name"]
        cycleway[projection.prefix] = object.tags[prefixedSide] -- project the `side` to the `prefix`
        if BikelaneCategory(cycleway) then
          cycleway._centerline = "projected tag=" .. prefixedSide
          for _, sign in pairs(signs) do
            local isOneway = object.tags['oneway'] == 'yes' and object.tags['oneway:bicycle'] ~= 'no'
            if not (side == "" and sign > 0 and isOneway)  then -- skips implicit case for oneways
              if projection.postProcessing ~= nil or projection.postProcessing(cycleway, object.tags) then
                  FilterTags(cycleway, allowed_tags)
                  translateTable:insert({
                    tags = cycleway,
                    meta = Metadata(object),
                    geom = object:as_linestring(),
                    offset = sign * offset
                  })
              end
            end
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

