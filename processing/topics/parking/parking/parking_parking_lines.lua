package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parking/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_parking_lines")
require("exit_processing_parking_lines")
require("transform_parking_lines")


local parking_lines_table = osm2pgsql.define_table({
  name = 'parking_parking_lines',
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


function parking_parking_lines(object)
  local results = {}

  if exit_processing_parking_lines(object.tags) then return results end

  local transformed_objects = transform_parking_lines(object)
  for _, transformed_object in ipairs(transformed_objects) do
    local row = MergeTable({ geom = object:as_linestring() }, result_tags_parking_lines(transformed_object))
    parking_lines_table:insert(row)
  end

  return results
end
