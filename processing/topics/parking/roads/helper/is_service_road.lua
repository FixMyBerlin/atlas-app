package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Set")
require("Log")

function is_service_road(tags)
  if not tags.highway then return false end

  local allowed_highways = Set({
    "service",
    "track",
    "bus_guideway",
  })
  local is_allowed_highway = allowed_highways[tags.highway] or false
  local is_construction_highway = (tags.highway == "construction" and allowed_highways[tags.construction]) or false

  if (is_allowed_highway or is_construction_highway) then return true end
  return false
end
