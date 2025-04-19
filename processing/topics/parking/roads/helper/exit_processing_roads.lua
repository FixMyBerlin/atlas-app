package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("JoinSets")
require("Log")
require("exit_processing_access")

function exit_processing_roads(tags)
  if not tags.highway then return true end

  if exit_processing_access(tags) then return true end

  local allowed_highways = Set({
    "primary", "primary_link",
    "secondary", "secondary_link",
    "tertiary", "tertiary_link",
    "residential",
    "unclassified",
    "living_street",
    "pedestrian",
    "road",
  })
  local is_allowed_highway = allowed_highways[tags.highway] or false
  local is_construction_highway = (tags.highway == "construction" and allowed_highways[tags.construction]) or false
  if not (is_allowed_highway or is_construction_highway) then return true end

  return false
end
