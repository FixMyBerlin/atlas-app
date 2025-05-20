package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
require("Log")
require("obstacle_area_categories")

---@return table<string, { category: ObstacleCategory, object: OSMObject} | { category: nil, object: nil}>
function categorize_area(object)
  for _, category in ipairs(obstacle_area_categories) do
    if category:is_active(object.tags) then
      object.tags.side = category.perform_snap

      return {
        category = category,
        object = object
      }
    end
  end
  return {
    category = nil,
    object = nil
  }
end
