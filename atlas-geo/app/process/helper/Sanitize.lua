---@param value any
---@param allowed table
---@param default any
---@return any
-- makes sure that `value` is in the set `allowed`. Returns `default` if value is nil
function Sanitize(value, allowed, default)
  if value == nil then
    return default
  end
  if allowed[value] then
    return value
  end
  -- maybe add to TODO list or smth.
  return nil
end
