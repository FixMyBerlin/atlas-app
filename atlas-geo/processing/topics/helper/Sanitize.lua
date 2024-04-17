---@param value any
---@param allowed table
---@param fallback? any
---@return any
-- makes sure that `value` is in the set `allowed`. Returns `fallback` if value is nil
function Sanitize(value, allowed, fallback)
  if value == nil then
    return fallback
  end
  if allowed[value] then
    return value
  end
  -- maybe add to TODO list or smth.
  return nil
end
