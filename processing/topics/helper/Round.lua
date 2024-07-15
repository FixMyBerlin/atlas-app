--- round `value` to `digits` decimal positions
---@param value number
---@param digits integer
---@return number
function Round(value, digits)
  local factor = 10^digits
  return math.floor(value * factor + 0.5) / factor
end
