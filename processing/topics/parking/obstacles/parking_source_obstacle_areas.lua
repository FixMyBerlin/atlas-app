package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
require("MergeTable")
require("categorize_area")
require("result_tags_obstacles")

function parking_source_obstacle_areas(object)
  local results = {}
  if not object.is_closed then return results end
  if next(object.tags) == nil then return results end

  local result = categorize_area(object)
  if result.object then
    table.insert(results, MergeTable({ geom = result.object:as_polygon() }, result_tags_obstacles(result)))
  end

  return results
end
