package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("Log")
require("obstacle_area_categories")

---@class BestResult
---@field category
---@field object
--
---@return table<string, BestResult>
function categorize_area(object)
  for _, category in ipairs(obstacle_area_categories) do
    if category(object.tags) then
      local result_object = object
      result_object._side = "self"
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
