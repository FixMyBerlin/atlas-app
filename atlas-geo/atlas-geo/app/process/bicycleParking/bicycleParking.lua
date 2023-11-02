package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("Metadata")

local nodeTable = osm2pgsql.define_table({
  name = 'bicycleParking-points',
  ids = { type = 'node', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local areaTable = osm2pgsql.define_table({
  name = 'bicycleParking-areas',
  ids = { type = 'node', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})
function ExitProcessing(object) 
  if object.tags.amenity ~= 'bicycle_parking' then
    return true
  end
end

function osm2pgsql.process_node(object)
  local tags = object.tags
  if ExitProcessing(object) then return end
  nodeTable:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) or not object.is_closed then return end

  areaTable:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon(),
  })
end
