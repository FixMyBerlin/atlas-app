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

local presenceTable = osm2pgsql.define_table({
  name = 'bikelanes_presence',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'left', type = 'text'},
    { column = 'right', type = 'text'},
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

  local tags = object.tags

  -- categorize bike lanes (flat)
  local category = CategorizeBikelane(tags)
  if category ~= nil then
    FilterTags(tags, allowed_tags)
    IsFresh(object, "check_date:cycleway", tags)
    table:insert({
      category = category,
      tags = tags,
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
  local width = RoadWidth(tags)
  local presence = {[1] = nil, [-1] = nil}
  for _, transformation in pairs(Transformations) do
    for side, signs in pairs(sides) do
      local prefix = transformation.prefix
      local prefixedSide = prefix .. side
      -- this is the transformation:
      local cycleway = transformTags(tags, prefixedSide)
      cycleway.highway = transformation.highway
      cycleway[prefix] = tags[prefixedSide] -- project `prefix:side` to `prefix`
      category = CategorizeBikelane(cycleway)
      for _, sign in pairs(signs) do
        if cycleway[prefix] == "no" or cycleway[prefix] == "separate" then
          if prefix == 'cycleway' then
            -- we might have data but need to find it
            presence[sign] = presence[sign] or "present"
          end
        else
          local isOneway = tags['oneway'] == 'yes' and tags['oneway:bicycle'] ~= 'no'
          if not (side == "" and sign > 0 and isOneway and prefix == 'bicycle') then
            if category ~= nil then
              FilterTags(cycleway, allowed_tags)
              IsFresh(object, "check_date:" .. prefix, cycleway)
              transformTable:insert({
                category = category,
                tags = cycleway,
                meta = Metadata(object),
                geom = object:as_linestring(),
                offset = sign * width / 2
              })
              -- we have data and know it
              presence[sign] = presence[sign] or "present"
            end
          else
            -- we don't expect data
            presence[sign] = presence[sign] or "not expected"
          end
        end
      end
    end
  end

  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone
  -- TODO 2: into excludeTable
  if Set({"path", "cycleway", "track", "residential", "unclassified", "service", "living_street", "pedestrian"," service", "motorway_link", "motorway", "footway", "steps"})[tags.highway] then
    intoExcludeTable(object, "no infrastructure expected for highway type: " .. tags.highway)
    return
  elseif tags.motorroad or tags.expressway or tags.cyclestreet or tags.bicycle_road then
    intoExcludeTable(object, "no (extra) infrastructure expected for motorroad, express way and cycle streets")
    return
  -- elseif tags.maxspeed and tags.maxspeed <= 20 then
  --   intoExcludeTable(object, "no infrastructure expected for max speed <= 20 kmh")
  --   return
  end
  -- TODO excludeTable: For ZES, we exclude "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts
  presenceTable:insert({
    tags = tags,
    geom = object:as_linestring(),
    left = presence[1] or "no",
    right = presence[-1] or "no"
  })
end
