package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Log")

function is_vehicle_path(tags)
  if not tags.highway then return false end

  return (
    (tags.motor_vehicle ~= nil and tags.motor_vehicle ~= "no") or
    (tags.vehicle ~= nil and tags.vehicle ~= "no" and tags.motor_vehicle ~= "no") or
    (tags.emergency ~= nil and tags.emergency ~= "no")
  )
end
