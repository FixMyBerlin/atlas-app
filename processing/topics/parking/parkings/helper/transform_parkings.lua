package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/helper/?.lua"
require("Log")
require("Clone")
require("parking_transformations")

local parking_transformation = centerline_transformation_class.new({ prefix = "parking" })

function transform_parkings(object)
  local transformed_objects = transform_objects(object.tags, { parking_transformation })

  local result_objects = {}
  for _, side in ipairs({ "left", "right" }) do
    local side_tags = transformed_objects[side]
    if (side_tags) then
      local side_object = MetaClone(object)
      side_object._side = side
      side_object.tags = side_tags
      -- Move some helper tags
      side_object._parent_tags = side_tags._parent_tags
      side_object.tags.side = side
      side_object.tags.parent_highway = side_tags._parent_highway
      -- Reset the helper transformation helper tags
      side_object.tags._infix = nil
      side_object.tags._parent_highway = nil
      side_object.tags._parent_highway = nil
      side_object.tags._parent_tags = nil
      side_object.tags._prefix = nil
      side_object.tags._side = nil
      table.insert(result_objects, side_object)
    end
  end
  return result_objects
end
