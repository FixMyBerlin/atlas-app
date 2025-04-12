package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("Clone")
require("Sanitize")
require("obstacle_point_categories")
local inspect = require("inspect")

function duplicate_left_right(object)
  local result = {}

  -- Filter obstacle_categories to those with side_key ~= nil
  local side_key_categories = {}
  for _, category in ipairs(obstacle_point_categories) do
    if category.side_key ~= nil then
      table.insert(side_key_categories, category)
    end
  end

  -- Check which side_keys are in object.tags
  -- Return transformed objects for the first match.
  for _, category in ipairs(side_key_categories) do
    local side_key = category.side_key
    local side_value = Sanitize(object.tags[side_key], { 'left', 'right', 'both' })

    if side_value then
      -- Check if the value is left|right|both
      if side_value == "both" then
        -- Create explicit left and right objects
        local left_object = MetaClone(object)
        left_object.tags[side_key] = "left"
        left_object._transformed = "left"
        table.insert(result, left_object)

        local right_object = MetaClone(object)
        right_object.tags[side_key] = "right"
        right_object._transformed = "right"
        table.insert(result, right_object)
      else
        -- Create a single object with the specific side
        local transformed_object = MetaClone(object)
        transformed_object.tags[side_key] = side_value
        transformed_object._transformed = side_value
        table.insert(result, transformed_object)
      end
      return result -- Return early as we only process the first match
    end
  end

  -- If no matches, return the original object with _transformed = nil
  object._transformed = nil
  table.insert(result, object)
  return result
end
