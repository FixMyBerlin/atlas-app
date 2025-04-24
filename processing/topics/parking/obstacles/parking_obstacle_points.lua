package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
require("Log")
require("MergeTable")
require("categorize_and_transform_points")
require("result_tags_obstacles")

local obstacle_points_table = osm2pgsql.define_table({
  name = 'parking_obstacle_points',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'point', projection = 5243 },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'minzoom', 'geom' }, method = 'gist' },
    { column = 'id',                  method = 'btree', unique = true }
  }
})

function parking_obstacle_points(object)
  local results = {}
  if next(object.tags) == nil then return results end

  local self_left_right = categorize_and_transform_points(object)
  for _, result in pairs(self_left_right) do
    if result.object then
      local row = MergeTable({ geom = result.object:as_point() }, result_tags_obstacles(result))
      obstacle_points_table:insert(row)
    end
  end

  return results
end
