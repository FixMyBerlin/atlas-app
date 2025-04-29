package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/helper?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/?.lua"
require("JoinSets")
require("HighwayClasses")
require("Log")
require("exit_processing_kerbs")

function exit_processing_parkings(tags)
  if not tags.highway then return true end

  if exit_processing_kerbs(tags) then return true end

  for key, _ in pairs(tags) do
    if key:match("^parking:") then
      return false
    end
  end

  return true
end
