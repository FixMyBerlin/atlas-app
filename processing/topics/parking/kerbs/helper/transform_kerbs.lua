package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("Log")
require("Clone")

function transform_kerbs(object)
  local transformed_objects = {}
  for _, side in ipairs({ "left", "right" }) do
    local side_object = MetaClone(object)
    side_object._side = side
    table.insert(transformed_objects, side_object)
  end
  return transformed_objects
end
