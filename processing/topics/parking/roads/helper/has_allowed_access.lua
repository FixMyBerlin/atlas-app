package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Log")

function has_allowed_access(tags)
  if not tags.highway then return false end

  if tags.motor_vehicle ~= nil and tags.motor_vehicle == "no" then return false end
  if tags.vehicle ~= nil and tags.vehicle == "no" then return false end
  if tags.emergency ~= nil and tags.emergency == "no" then return false end

  return true
end
