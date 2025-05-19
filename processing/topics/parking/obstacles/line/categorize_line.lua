package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
require("Log")
require("obstacle_line_categories")

---@return table<string, { category: ObstacleCategory, object: OSMObject} | { category: nil, object: nil}>
function categorize_line(object)
  for _, category in ipairs(obstacle_line_categories) do
    if category:is_active(object.tags) then
      local result_object = object
      result_object.tags.side = "self"
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
