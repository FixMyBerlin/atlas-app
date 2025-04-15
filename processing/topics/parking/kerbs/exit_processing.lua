package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
require("JoinSets")
require("HighwayClasses")
require("Log")

function exit_processing(tags)
  if not tags.highway then return true end

  -- Filter based on highway classes
  local other_motor_vehicle_roads = Set({ "service", "track", "bus_guideway" })
  local allowed_highways = JoinSets({ MajorRoadClasses, MinorRoadClasses, other_motor_vehicle_roads })
  local is_allowed_highway = allowed_highways[tags.highway] or false
  local is_construction_highway = (tags.highway == "construction" and allowed_highways[tags.construction]) or false
  if not (is_allowed_highway or is_construction_highway) then return true end

  -- Filter based on access
  if tags.motor_vehicle ~= nil and tags.motor_vehicle ~= "no" then return true end
  if tags.vehicle ~= nil and tags.vehicle ~= "no" then return true end
  if tags.emergency ~= nil and tags.emergency ~= "no" then return true end

  return false
end
