package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_kerb")
require("exit_processing_kerbs")
require("transform_kerbs")

local kerbs_table = osm2pgsql.define_table({
  name = 'parking_kerbs',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})

local node_kerb_mapping = osm2pgsql.define_table({
  name = '_node_kerb_mapping',
  ids = { type = 'way', id_column = 'way_id', create_index = 'always'},
  columns = {
    { column = 'node_id', type = 'bigint', not_null = true },
    { column = 'idx', type = 'int', not_null = true },
  },
  indexes = {
    { column = 'node_id', method = 'btree'}
  }
})

function parking_kerbs(object)

  if exit_processing_kerbs(object.tags) then return end

  for idx, node_id in ipairs(object.nodes) do
    node_kerb_mapping:insert({
      node_id = node_id,
      idx = idx
    })
  end

  local transformed_objects = transform_kerbs(object)
  for _, transformed_object in ipairs(transformed_objects) do
    local row = MergeTable({ geom = object:as_linestring() }, result_tags_kerb(transformed_object))
    kerbs_table:insert(row)

  end
end
