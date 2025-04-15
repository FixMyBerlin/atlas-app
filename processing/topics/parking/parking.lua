package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("parking_source_obstacle_points")
require("parking_source_obstacle_areas")
require("parking_source_kerbs")
require("Log")

local source_obstacle_points_table = osm2pgsql.define_table({
  name = 'parking_source_obstacles_points',
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

local source_obstacle_areas_table = osm2pgsql.define_table({
  name = 'parking_source_obstacles_areas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'polygon' },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})

local source_kerbs_table = osm2pgsql.define_table({
  name = 'parking_source_kerbs',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring' },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})

function osm2pgsql.process_node(object)
  local results = parking_source_obstacle_points(object)
  for _, result in ipairs(results) do
    source_obstacle_points_table:insert(result)
  end
end

function osm2pgsql.process_way(object)
  local result_obstacles = parking_source_obstacle_areas(object)
  if result_obstacles then
    for _, result in ipairs(result_obstacles) do
      source_obstacle_areas_table:insert(result)
    end
  end

  local result_kerbs = parking_source_kerbs(object)
  for _, result in ipairs(result_kerbs) do
    source_kerbs_table:insert(result)
  end
end

-- function osm2pgsql.process_relation(object)
-- end
