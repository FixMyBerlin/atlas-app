package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
require("MergeTable")
require("categorize_area")
require("result_tags_obstacles")


local obstacle_areas_table = osm2pgsql.define_table({
  name = 'parking_areas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'polygon', projection = 5243 },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})


function parking_source_obstacle_areas(object)
  local results = {}
  if not object.is_closed then return results end
  if next(object.tags) == nil then return results end

  local result = categorize_area(object)
  if result.object then
    obstacle_areas_table:insert(results, MergeTable({ geom = result.object:as_polygon() }, result_tags_obstacles(result)))
  end

  return results
end
