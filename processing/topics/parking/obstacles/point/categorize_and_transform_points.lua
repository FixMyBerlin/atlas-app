package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
require("Clone")
require("Log")
require("Sanitize")
require("obstacle_point_categories")

-- Categorize the object and transforms it if needed. Picks the best result for self, left, right.
-- The best result is the one with the largest buffer.
-- Handles three cases of data:
-- - "self": Points that are applied once at their given location
-- - "left/right": Points that have a key that specifies the side; those are duplicated based on that key.
-- - "left/right": Points that are are always applied to both sides; those are always duplicated.
---@class Object
---@field tags table<string, string>
---@field _side string|nil
--
---@class BestResult
---@field category ObstacleCategory|nil
---@field object Object|nil
--
---@class BestResultTable
---@field self BestResult
---@field left BestResult
---@field right BestResult
--
---@return table<string, BestResult>
function categorize_and_transform_points(object)
  ---@type table<string, number>
  local max_buffer = { self = -1, left = -1, right = -1 }

  ---@type BestResultTable
  local best_result = {
    self = { category = nil, object = nil },
    left = { category = nil, object = nil },
    right = { category = nil, object = nil },
  }
  for _, category in ipairs(obstacle_point_categories) do
    if category:is_active(object.tags) then -- Updated to use is_active method
      -- CASE: perform_snap="self"
      -- Points that are snapped to the parking line nearby, like trees or street_laps
      if(category.perform_snap == "self") then
        if category:get_perform_buffer(object.tags) > max_buffer['self'] then
          max_buffer['self'] = category:get_perform_buffer(object.tags)
          best_result['self'].category = category

          local side_object = MetaClone(object)
          side_object._side = "self"
          best_result['self'].object = side_object
        end
      end

      -- CASE: perform_snap="side" WITHOUT side_key
      -- Points that are always transformed to left/right
      if(category.perform_snap == "side" and not category.side_key) then
        for _, side in ipairs({ "left", "right" }) do
          if category:get_perform_buffer(object.tags) > max_buffer[side] then
            max_buffer[side] = category:get_perform_buffer(object.tags)
            best_result[side].category = category

            local side_object = MetaClone(object)
            side_object._side = side
            best_result[side].object = side_object
          end
        end
      end

      -- CASE: perform_snap="side" WITH side_key
      -- Points that are only transformed if a given side is present (including "both")
      if (category.perform_snap == "side" and category.side_key) then
        local side_set = { object.tags[category.side_key] }
        if (object.tags[category.side_key] == "both") then
          side_set = { "left", "right" }
        end

        for _, side in ipairs(side_set) do
          if category:get_perform_buffer(object.tags) > max_buffer[side] then
            max_buffer[side] = category:get_perform_buffer(object.tags)
            best_result[side].category = category

            local side_object = MetaClone(object)
            side_object.tags[category.side_key] = side -- overwrite "both" with left/right
            side_object._side = side
            best_result[side].object = side_object
          end
        end
      end
    end
  end

  return best_result
end
