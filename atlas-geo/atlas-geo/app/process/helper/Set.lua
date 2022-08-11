-- https://www.lua.org/pil/11.5.html
function Set(list)
  local set = {}
  -- Reminder: ipairs will make sure 'list' is in it's strucutre an array by skipping all object like keys (string, out of order-keys).
  for _, l in ipairs(list) do set[l] = true end
  return set
end
