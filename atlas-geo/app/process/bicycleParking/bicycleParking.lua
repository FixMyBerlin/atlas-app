package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("CopyTags")
require("Metadata")

local nodeTable = osm2pgsql.define_table({
  name = 'bicycleParking-points',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local areaTable = osm2pgsql.define_table({
  name = 'bicycleParking-areas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'polygon' },
  }
})

function ExitProcessing(object) 
  if object.tags.amenity ~= 'bicycle_parking' then
    return true
  end
end

function capacityNormalization(tags)
  local capacities = {capacity = tonumber(tags.capacity) or 0}
  for key, val in pairs(tags) do
    if osm2pgsql.has_prefix(key, "capacity") then
      val = tonumber(val)
      if val ~= nil then
        capacities.capacity = capacities.capacity - val
      end
      capacities[key] = val
    end
  end
  for k, v in pairs(capacities) do
    if v == 0 then
      capacities[k] = nil
    end
  end
  return capacities
end

-- this is the list of tags found in the wiki: https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbicycle_parking
local tags_cc = {"area", "operator", "covered", "indoor", "foot_traffi", "access", "capacity", "fee","bicycle_parking","cyclestreets_id", "maxstay", "surveillance"}

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end
  local tags = capacityNormalization(object.tags)
  CopyTags(object.tags, tags, tags_cc, "osm_")
  nodeTable:insert({
    tags = capacityNormalization(tags),
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) or not object.is_closed then return end

  local tags = capacityNormalization(object.tags)
  CopyTags(object.tags, tags, tags_cc, "osm_")
  
  areaTable:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_polygon(),
  })
  nodeTable:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_polygon():centroid(),
  })
end
