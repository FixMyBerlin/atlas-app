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

function parking_kerbs(object)
  local results = {}

  if exit_processing_kerbs(object.tags) then return results end

  local transformed_objects = transform_kerbs(object)
  for _, transformed_object in ipairs(transformed_objects) do
    kerbs_table:insert(results, MergeTable({ geom = object:as_linestring() }, result_tags_kerb(transformed_object)))
  end

  return results
end
