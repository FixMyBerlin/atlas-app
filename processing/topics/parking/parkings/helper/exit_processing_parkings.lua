package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/?.lua"
require("JoinSets")
require("HighwayClasses")
require("Log")
require("has_allowed_access")
require("is_main_road")
require("is_service_road")
require("is_vehicle_path")

function exit_processing_parkings(tags)
  if not tags.highway then return true end
  if not has_allowed_access(tags) then return true end
  if not (is_main_road(tags) or is_service_road(tags) or is_vehicle_path(tags)) then return true end

  for key, _ in pairs(tags) do
    if key:match("^parking:") then
      return false
    end
  end

  return true
end
