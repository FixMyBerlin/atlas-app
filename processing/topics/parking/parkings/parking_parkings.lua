package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_parkings")
require("exit_processing_parkings")
require("transform_parkings")

local db_table = osm2pgsql.define_table({
  name = '_parking_parkings',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'side',    type = 'text' }
  },
  indexes = {
    { column = { 'osm_id', 'side' }, method = 'btree' },
  }
})

function parking_parkings(object)
  if exit_processing_parkings(object.tags) then return end

  local transformed_objects = transform_parkings(object)
  for _, transformed_object in ipairs(transformed_objects) do
    -- Note: No geometry for this table
    db_table:insert(result_tags_parkings(transformed_object))
  end
end
