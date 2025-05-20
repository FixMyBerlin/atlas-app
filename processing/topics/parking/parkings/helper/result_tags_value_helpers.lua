require('init')
require("Log")
require("Sanitize")
require("sanitize_for_logging")
require("is_driveway")

-- `parking` is our main tag.
-- for is_driveway this is alway some precise value (because everything else is excluded)
-- for is_road this with either "missing" or some precise value.
-- except for dual_carriageway|s when we fall back to "not_expected" instead of "missing"
function parking_value(object)
  -- We allow "yes" as unspecified value for edge cases when the position is not yet know
  local result = sanitize_for_logging(object.tags.parking, {"no", "yes", "lane", "street_side", "on_kerb", "half_on_kerb", "shoulder", "separate"})
  if (object._parent_tags.dual_carriageway == "yes") then
    result = result or 'not_expected'
  end
  result = result or "missing"
  return result
end

-- `operator_type`
-- for is_road, sanitize the value or nil
-- for is_driveway, sanitize but add an error because we excpet this to be present
function operator_type_value(object)
  local result = Sanitize(object.tags['operator:type'], {"public", "private"})
  if is_driveway(object.tags) then
    result = sanitize_for_logging(object.tags['operator:type'], {"public", "private"})
  end

  return result
end
