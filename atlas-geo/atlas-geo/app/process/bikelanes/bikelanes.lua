package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("RoadWidth")
require("FilterHighways")
require("CheckDataWithinYears")
require("StartsWith")
require("IsFresh")
require("categories")
require("transformations")

local table = osm2pgsql.define_table({
  name = '_bikelanes_temp',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'category', type = 'text' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local translateTable = osm2pgsql.define_table({
  name = 'bikelanesCenterline',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'category', type = 'text' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type = 'real' }
  }
})


local skipTable = osm2pgsql.define_table({
  name = 'bikelanes_skipList',
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
  "_centerline",
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

local function intoSkipList(object, reason)
  skipTable:insert({
    tags = object.tags,
    meta = Metadata(object),
    reason = reason,
    geom = object:as_linestring()
  })
end

-- transform all tags from ["prefix:subtag"]=val -> ["subtag"]=val
local function transformTags(tags, prefix)
  local transformedTags = { name = tags.name }
  for prefixedKey, val in pairs(tags) do
    if prefixedKey ~= prefix and StartsWith(prefixedKey, prefix) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key = string.sub(prefixedKey, string.len(prefix) + 2)
      transformedTags[key] = val
    end
  end
  return transformedTags
end

function osm2pgsql.process_way(object)
  -- filter highway classes
  if not object.tags.highway or not HighwayClasses[object.tags.highway] then return end

  local skip, reason = FilterHighways(object.tags)
  if skip then
    intoSkipList(object, reason)
    return
  end

  -- categorize bike lanes (flat)
  local category = CategorizeBikelane(object.tags)
  if category ~= nil then
    FilterTags(object.tags, allowed_tags)
    IsFresh(object, "check_date:cycleway", object.tags)
    table:insert({
      tags = object.tags,
      category = category,
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
  for _, transformation in pairs(Transformations) do
    local offset = RoadWidth(object.tags) / 2
    for side, signs in pairs(sides) do
      local prefixedSide = transformation.prefix .. side
      if object.tags[prefixedSide] ~= "no" and object.tags[prefixedSide] ~= "separate" then
        -- this is the transformation:
        local cycleway = transformTags(object.tags, prefixedSide)
        cycleway.highway = transformation.highway
        cycleway[transformation.prefix] = object.tags[prefixedSide] -- project `prefix:side` to `prefix`

        category = CategorizeBikelane(cycleway)

        if category ~= nil then
          cycleway._centerline = "projected tag=" .. prefixedSide
          for _, sign in pairs(signs) do
            local isOneway = object.tags['oneway'] == 'yes' and object.tags['oneway:bicycle'] ~= 'no'
            if not (side == "" and sign > 0 and isOneway) then -- skips implicit case for oneways
              FilterTags(cycleway, allowed_tags)
              IsFresh(object, "check_date:" .. transformation.prefix, cycleway)
              translateTable:insert({
                tags = cycleway,
                category = category,
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

  -- TODO SKIPLIST: For ZES, we skip "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts
  intoSkipList(object, "no category applied")
end
