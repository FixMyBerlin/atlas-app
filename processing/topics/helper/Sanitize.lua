require('init')
require("Set")

---@param value any
---@param allowed table
---@param nil_fallback? any
---@return any
-- makes sure that `value` is in the array `allowed`. Returns `fallback` if value is nil
function Sanitize(value, allowed, nil_fallback)
  if value == nil then
    return nil_fallback or nil
  end

  if Set(allowed)[value] then
    return value
  end

  return nil
end
