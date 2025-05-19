package.path = package.path .. ";/processing/topics/helper/?.lua"
local is_env = require("is_env")
require("Sanitize")
require("Log")

DISALLOWED_VALUE = "DISALLOWED_VALUE"

-- One production: Just Sanitize; On staging and development: Sanitize with fallback DISALLOWED_VALUE.
-- Use together with sanitize_cleanup_and_log()
function sanitize_for_logging(value, allowed)
  if is_env.is_production then
    return Sanitize(value, allowed)
  end

  if value == nil then
    return nil
  end

  if Set(allowed)[value] then
    return value
  end

  return DISALLOWED_VALUE
end
