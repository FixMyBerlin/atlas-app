package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("JoinSets")
require("Log")
require("exit_processing_access")

function exit_processing_service_roads(tags)
  if not tags.highway then return true end

  if exit_processing_access(tags) then return true end

  local allowed_highways = Set({
    "service",
    "track",
    "bus_guideway",
  })
  local is_allowed_highway = allowed_highways[tags.highway] or false
  local is_construction_highway = (tags.highway == "construction" and allowed_highways[tags.construction]) or false
  local can_be_used_by_vehicles = (
    (tags.motor_vehicle ~= nil and tags.motor_vehicle ~= "no") or
    (tags.vehicle ~= nil and tags.vehicle ~= "no" and tags.motor_vehicle ~= "no") or
    (tags.emergency ~= nil and tags.emergency ~= "no")
  )

  if not (
    is_allowed_highway or
    is_construction_highway or
    can_be_used_by_vehicles
  ) then return true end

  return false
end
