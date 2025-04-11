package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("parking_obstacle_points")

local obstacle_points = osm2pgsql.define_table({
  name = 'parking_obstacles_points',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'point' },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})

function osm2pgsql.process_node(object)
  local result = parking_obstacle_points(object)
  if(result) then
    obstacle_points:insert(result)
  end
end

function osm2pgsql.process_way(object)
end

function osm2pgsql.process_relation(object)
end
