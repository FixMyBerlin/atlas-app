package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_parkings")
require("is_parking")
require("transform_parkings")

local db_table = osm2pgsql.define_table({
  name = '_parking_parkings',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'side',    type = 'text' },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
  },
  indexes = {
    { column = { 'osm_id', 'side' }, method = 'btree' },
  }
})

function parking_parkings(object)
  if not is_parking(object.tags) then return end

  local transformed_objects = transform_parkings(object)
  for _, transformed_object in ipairs(transformed_objects) do

    local result = result_tags_parkings(transformed_object)
    local cleaned_tags, replaced_tags = sanitize_cleaner(result.tags, transformed_object.tags)
    result.tags = cleaned_tags

    parking_errors(transformed_object, replaced_tags, 'parking_parkings')

    -- Note: No geometry for this table
    db_table:insert(result)
  end
end
