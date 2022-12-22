package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("RoadWidth")
require("ExcludeHighways")
require("CheckDataWithinYears")
require("StartsWith")
require("IsFresh")
require("categories")
require("transformations")

local table = osm2pgsql.define_table({
  name = '_bikelanes_temp',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'category', type = 'text' },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local transformTable = osm2pgsql.define_table({
  name = '_bikelanes_transformed',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'category', type = 'text' },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type = 'real' }
  }
})

local excludeTable = osm2pgsql.define_table({
  name = 'bikelanes_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom', type = 'linestring' },
  }
})

-- whitelist of tags we want to insert intro the DB
local allowed_tags = Set({
  "_projected_tag",
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
  "oneway", -- we use oneway:bicycle=no (which is transformed to oneway=no) to add a notice in the UI about two way cycleways in one geometry
  "segregated",
  "smoothness",
  "surface",
  "traffic_sign",
  "width", -- experimental
})

local function intoExcludeTable(object, reason)
  excludeTable:insert({
    tags = object.tags,
    meta = Metadata(object),
    reason = reason,
    geom = object:as_linestring()
  })
end

-- transform all tags from ["prefix:subtag"]=val -> ["subtag"]=val
local function transformTags(tags, prefix)
  local transformedTags = { _projected_tag = prefix }
  for prefixedKey, val in pairs(tags) do
    if prefixedKey ~= prefix and StartsWith(prefixedKey, prefix) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key = string.sub(prefixedKey, string.len(prefix) + 2)
      transformedTags[key] = val
    end
  end
  return transformedTags
end

function applyTransformation(object, transformation)
  local result = {}
  local sides = {
    [":right"] = { -1 },
    [":left"] = { 1 },
    [":both"] = { -1, 1 },
    [""] = { -1, 1 }
  }
  for side, signs in pairs(sides) do
    local prefixedSide = transformation.prefix .. side
    local cycleway = transformTags(object.tags, prefixedSide)
    cycleway[transformation.prefix] = object.tags[prefixedSide] -- project `prefix:side` to `prefix`
    cycleway.highway = transformation.highway
    cycleway.name = object.name
    IsFresh(object, "check_date:" .. transformation.prefix, cycleway)
    -- post processing to filter oneway
    result[cycleway] = signs
  end
  return result
end

function osm2pgsql.process_way(object)
  -- filter highway classes
  if not object.tags.highway or not HighwayClasses[object.tags.highway] then return end

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    intoExcludeTable(object, reason)
    return
  end

  -- categorize bike lanes (flat)
  local category = CategorizeBikelane(object.tags)
  if category ~= nil then
    FilterTags(object.tags, allowed_tags)
    IsFresh(object, "check_date:cycleway", object.tags)
    table:insert({
      category = category,
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
    return
  end

  -- categorize bike lanes (nested)
  local sides = {
    [":right"] = { -1 },
    [":left"] = { 1 },
    [":both"] = { -1, 1 },
    [""] = { -1, 1 }
  }

  local sign2side = { [1] = "left", [-1]="right"}

  local width = RoadWidth(object.tags)
  for _, transformation in pairs(Transformations) do
    for side, signs in pairs(sides) do
      local prefixedSide = transformation.prefix .. side
      -- this is the transformation:
      local cycleway = transformTags(object.tags, prefixedSide)
      cycleway.highway = transformation.highway
      cycleway[transformation.prefix] = object.tags[prefixedSide] -- project `prefix:side` to `prefix`
      category = CategorizeBikelane(cycleway)
      if category ~= nil then
        for _, sign in pairs(signs) do
          if object.tags[prefixedSide] ~= "no" and object.tags[prefixedSide] ~= "separate" then
            local isOneway = object.tags['oneway'] == 'yes' and object.tags['oneway:bicycle'] ~= 'no'
            if not (side == "" and sign > 0 and isOneway and transformation.prefix == 'bicycle') then
              FilterTags(cycleway, allowed_tags)
              IsFresh(object, "check_date:" .. transformation.prefix, cycleway)
              transformTable:insert({
                category = category,
                tags = cycleway,
                meta = Metadata(object),
                geom = object:as_linestring(),
                offset = sign * width / 2
              })
              -- we have data
              object.tags["data:"..sign2side[sign]] = "present"
            else
              -- we don't expect data
              object.tags["data:"..sign2side[sign]] = "not expected"
            end
          elseif transformation.prefix == 'bicycle' then
            -- we (should) have data
            object.tags["data:"..sign2side[sign]] = "present"
          end
        end
      end
    end
  end

  -- TODO: Filter ways where we dont expect bicycle infrastructure

  -- TODO excludeTable: For ZES, we exclude "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts
  intoExcludeTable(object, "no category applied")
end
