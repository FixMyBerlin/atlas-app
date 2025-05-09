package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("has_allowed_access")
require("is_main_road")
require("is_service_road")
require("is_vehicle_path")

local db_table = osm2pgsql.define_table({
  name = '_parking_roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
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

function parking_roads(object)
  if not has_allowed_access(object.tags) then return end
  local is_main = is_main_road(object.tags)
  local is_service = is_service_road(object.tags)
  local allows_vehicles = is_vehicle_path(object.tags)
  if not (is_main or is_service or allows_vehicles) then return end

  local row = MergeTable({ geom = object:as_linestring(), is_service = is_service}, result_tags_roads(object))
  db_table:insert(row)
end
