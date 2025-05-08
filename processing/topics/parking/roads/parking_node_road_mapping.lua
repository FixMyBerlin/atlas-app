package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_roads")
require("exit_processing_service_roads")

local db_table = osm2pgsql.define_table({
  name = '_parking_node_road_mapping',
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

function parking_node_road_mapping(object)
  local exit_road = exit_processing_roads(object.tags)
  local exit_service_road = exit_processing_service_roads(object.tags)
  if exit_road and exit_service_road then return end

  for idx, node_id in ipairs(object.nodes) do
    local row = {
      node_id = node_id,
      idx = idx,
      is_terminal_node = idx == 1 or idx == #object.nodes,
      is_service = not exit_service_road,
    }
    db_table:insert(row)
  end
end
