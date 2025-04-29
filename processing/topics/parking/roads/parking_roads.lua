package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_roads")


local roads_table = osm2pgsql.define_table({
  name = '_parking_roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
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
  },
  indexes = {
    { column = 'node_id', method = 'btree'},
    { column = 'way_id', method = 'btree'},
    { column = {'node_id', 'way_id'}, method = 'btree'}
  }
})


function parking_roads(object)
  if exit_processing_roads(object.tags) then return nil end

  for idx, node_id in ipairs(object.nodes) do
    local is_terminal_node = idx == 1 or idx == #object.nodes
    node_road_mapping:insert({
      node_id = node_id,
      idx = idx,
      is_terminal_node = is_terminal_node,
    })
  end
  local row = MergeTable({ geom = object:as_linestring() }, result_tags_roads(object))
  roads_table:insert(row)
end
