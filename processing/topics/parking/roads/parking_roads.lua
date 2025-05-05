package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_roads")
require("exit_processing_service_roads")


local roads_table = osm2pgsql.define_table({
  name = '_parking_roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
    { column = 'is_service', type = 'boolean'},
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'osm_id' }, method = 'btree' },
    { column = { 'minzoom', 'geom' }, method = 'gist' },
  }
})

local node_road_mapping = osm2pgsql.define_table({
  name = '_node_road_mapping',
  ids = { type = 'way', id_column = 'way_id', create_index = 'always'},
  columns = {
    { column = 'node_id', type = 'bigint', not_null = true },
    { column = 'idx', type = 'int', not_null = true },
    { column = 'is_terminal_node', type = 'boolean', not_null = true },
    { column = 'is_service', type = 'boolean'},
  },
  indexes = {
    { column = 'node_id', method = 'btree'},
    { column = 'way_id', method = 'btree'},
    { column = {'node_id', 'way_id'}, method = 'btree'}
  }
})


function parking_roads(object)
  local exit_road = exit_processing_roads(object.tags)
  local exit_service_road = exit_processing_service_roads(object.tags)

  if exit_road and exit_service_road then return end
  local is_service = not exit_service_road
  for idx, node_id in ipairs(object.nodes) do
    local is_terminal_node = idx == 1 or idx == #object.nodes
    node_road_mapping:insert({
      node_id = node_id,
      idx = idx,
      is_terminal_node = is_terminal_node,
      is_service = is_service,
    })
  end
  local result_tags_roads = result_tags_roads(object)
  local row = MergeTable({ geom = object:as_linestring(), is_service = is_service}, result_tags_roads)
  roads_table:insert(row)
end
