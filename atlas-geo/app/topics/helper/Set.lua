-- https://www.lua.org/pil/11.5.html

-- * @desc `Set({ 'item' })''
-- * @returns `{ ["item"]: true }`
function Set(array)
  local set = {}
  -- Reminder: ipairs will make sure 'array' is in it's strucutre an array by skipping all object like keys (string, out of order-keys).
  for _, l in ipairs(array) do set[l] = true end
  return set
end
