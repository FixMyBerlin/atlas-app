package.path = package.path .. ';/processing/topics/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/off_street_parking/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/off_street_parking/areas/?.lua'
require('DefaultId')
require('Metadata')
require('sanitize_cleaner')
local categorize_off_street_parking = require('categorize_off_street_parking')
local off_street_parking_area_categories = require('off_street_parking_area_categories')

local db_table = osm2pgsql.define_table({
  name = 'off_street_parking_areas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',   type = 'text', not_null = true },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'polygon' }, -- default projection for vector tiles
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = {'minzoom', 'geom'}, method = 'gist' },
    { column = 'id', method = 'btree', unique = true  },
  }
})

local function off_street_parking_areas(object)
  if not object.is_closed then return end
  if next(object.tags) == nil then return end

  local result = categorize_off_street_parking(object, off_street_parking_area_categories)
  if result.object then
    local cleaned_tags, replaced_tags = sanitize_cleaner(result_tags_obstacles(result), result.object.tags)
    parking_errors(result.object, replaced_tags, 'parking_obstacle_areas')

    local row = MergeTable({ geom = result.object:as_polygon() }, cleaned_tags)
    db_table:insert(row)
  end
end

return off_street_parking_areas
