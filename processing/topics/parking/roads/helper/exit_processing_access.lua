package.path = package.path .. ";/processing/topics/helper/?.lua"
require("JoinSets")
require("HighwayClasses")
require("Log")

function exit_processing_access(tags)
  if not tags.highway then return true end

  if tags.motor_vehicle ~= nil and tags.motor_vehicle == "no" then return true end
  if tags.vehicle ~= nil and tags.vehicle == "no" then return true end
  if tags.emergency ~= nil and tags.emergency == "no" then return true end

  return false
end
