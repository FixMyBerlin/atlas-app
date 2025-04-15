package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point?.lua"
require("Log")
require("MergeTable")
require("categorize_and_transform_points")
require("result_tags_obstacles")

function parking_obstacle_points(object)
  local results = {}
  if next(object.tags) == nil then return results end

  local self_left_right = categorize_and_transform_points(object)
  for _, result in pairs(self_left_right) do
    if result.object then
      table.insert(results, MergeTable({ geom = result.object:as_point() }, result_tags_obstacles(result)))
    end
  end

  return results
end
