package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
require("Clone")
require("Log")
require("obstacle_point_categories")
require("transform_point_direction_tags")

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
    if category:is_active(object.tags) then
      -- Some guards to ensure we don't missconfigure the data
      -- Note that it's not true the other way around: perform_snap=side can have side_schema=nil+side_key=nil for cases like crossings.
      if(category.perform_snap == "self") then
        if(category.side_schema ~= nil) then error("ERROR: With perform_snap=self, side_schema must be nil") end
        if(category.side_key ~= nil) then error("ERROR: With perform_snap=self, side_key must be nil") end
      end

      -- CASE: Handle `side_suffix` (`foo:left=bar`)
      -- Handled separately from 1 and 2.
      if(category.side_schema == 'side_suffix') then
        for _, side in ipairs({ 'left', 'right' }) do
          local side_key = category.side_key .. ':' .. side
          local other_side_key = (side == 'left' and category.side_key .. ':right') or category.side_key .. ':left'
          local both_key = category.side_key .. ':both'

          if object.tags[side_key] or object.tags[both_key] then
            local buffer = category:get_perform_buffer(object.tags)
            if buffer > max_buffer[side] then
              max_buffer[side] = buffer
              best_result[side].category = category

              local side_object = MetaClone(object)
              side_object.tags[category.side_key] = side_object.tags[both_key] or side_object.tags[side_key]
              side_object.tags[other_side_key] = nil
              side_object.tags[side_key] = nil
              side_object.tags[both_key] = nil
              side_object.tags.side = side
              best_result[side].object = side_object
            end
          end
        end
      end

      if(category.side_schema == 'side_value' or
        category.side_schema == 'direction_key' or
        category.side_key == nil -- crossing=marked case
      ) then
        -- CASE: Handle `side_value` (`foo=left|right|both`)
        -- This is the main code below.
        --
        -- CASE: Handle `direction_key` (`foo=bar + direction=forward`)
        -- Handled by the `side_value` code after we modify the tags to follow that schema
        if(category.side_schema == 'direction_key') then
          transform_point_direction_tags(object.tags, category.side_key)
        end

        -- CASE: perform_snap="self"
        -- Points that are snapped to the parking line nearby, like trees or street_laps
        if(category.perform_snap == "self") then
          local buffer = category:get_perform_buffer(object.tags)
          if buffer > max_buffer['self'] then
            max_buffer['self'] = buffer
            best_result['self'].category = category

            local side_object = MetaClone(object)
            side_object.tags.side = "self"
            best_result['self'].object = side_object
          end
        end

        -- CASE: perform_snap="side" WITHOUT side_key
        -- Points that are always transformed to left/right
        if(category.perform_snap == "side" and not category.side_key) then
          for _, side in ipairs({ "left", "right" }) do
            local buffer = category:get_perform_buffer(object.tags)
            if buffer > max_buffer[side] then
              max_buffer[side] = buffer
              best_result[side].category = category

              local side_object = MetaClone(object)
              side_object.tags.side = side
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
            -- Log(category, '333')
            local buffer = category:get_perform_buffer(object.tags)
            -- Log(buffer, '333aaa')
            -- Log(side, '333bbb')
            -- Log(max_buffer[side], '333ccc')
            if buffer > max_buffer[side] then
              max_buffer[side] = buffer
              best_result[side].category = category

              local side_object = MetaClone(object)
              side_object.tags[category.side_key] = side -- overwrite "both" with left/right
              side_object.tags.side = side
              best_result[side].object = side_object
            end
          end
        end
      end
    end
  end

  return best_result
end
