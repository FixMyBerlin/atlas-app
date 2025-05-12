package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Set")
require("Log")
require("is_road")
require("is_driveway")

function is_parking(tags)
  -- We expect explict parking tagging on roads.
  -- Either parking allowed in some form; or explicitly disallowed; or missing.
  if is_road(tags) then
    return true
  end

  -- We only include driveways with explicit parking tagging.
  if is_driveway(tags) then
      for key, _ in pairs(tags) do
          if key:match("^parking:") then
              return true
          end
      end
  end

  return false
end
