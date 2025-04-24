package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_roads")

local roads_table = osm2pgsql.define_table({
  name = 'parking_roads',
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

local node_street_mapping = osm2pgsql.define_table({
  name = '_node_street_mapping',
  ids = { type = 'way', id_column = 'way_id', create_index = 'always'},
  columns = {
    { column = 'node_id',    type = 'integer', not_null = true },
  },
  indexes = {
    { column = 'node_id',                    method = 'btree'}
  }
})

function parking_road(object)
  if exit_processing_roads(object.tags) then return nil end
  local row = MergeTable({ geom = object:as_linestring() }, result_tags_roads(object))
  roads_table:insert(row)

  for _, node_id in ipairs(object.nodes) do
    node_street_mapping:insert({
      street_id = object.id,
      node_id = node_id
    })
  end
end
