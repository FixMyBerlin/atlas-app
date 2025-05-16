package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("sanitize_for_logging")

-- `parking` is our main tag.
-- for is_driveway this is alway some precise value (because everything else is excluded)
-- for is_road this with either "missing" or some precise value.
-- except for dual_carriageway|s when we fall back to "not_expected" instead of "missing"
function parking_value(object)
  local result = sanitize_for_logging(object.tags.parking, {"no", "lane", "street_side", "on_kerb", "half_on_kerb", "shoulder", "separate"})
  if (object._parent_tags.dual_carriageway == "yes") then
    result = result or 'not_expected'
  end
  result = result or "missing"
  return result
end

