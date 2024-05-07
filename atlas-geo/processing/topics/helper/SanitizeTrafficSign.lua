-- Remove all whitespaces after delimeters
local function stripWhitespaces(traffic_sign)
  local stripped = string.gsub(traffic_sign, ', ', ',')
  stripped = string.gsub(stripped, '; ', ';')
  return stripped
end

--- Cleanup the `traffic_sign=*` tag
--- @param traffic_sign string
--- @returns string
function SanitizeTrafficSign(traffic_sign)
  if traffic_sign == nil then
    return nil
  end
  if traffic_sign == "no" or traffic_sign == 'none' then
    return "none"
  end

  -- Docs: patterns with "^" target beginning of string

  -- This is the correct tagging, all traffic signs should start with DE:
  if string.find(traffic_sign, '^DE:%S') then
    return stripWhitespaces(traffic_sign)
  end

  local substitutions = {
    ['^DE: '] = 'DE:',
    ['^DE.'] = 'DE:',
    ['^D:'] = 'DE:',
    ['^D%.'] = 'DE:',
    ['^de:'] = 'DE:',
    ['^DE1'] = 'DE:1',
    ['^DE2'] = 'DE:2',
    ['^2'] = 'DE:2',
    ['^1'] = 'DE:1',
    -- These patterns could handle all the above in a more generalized way
    -- ['^DE?[:.]%s?'] = 'DE:',
    -- ['^de?[:.]%s?'] = 'DE:'
    -- ['^DE(%d)'] = 'DE:%1'
    -- ['^(%d)'] = 'DE:%1'
  }
  for pattern, substitude in pairs(substitutions) do
    local val, n = string.gsub(traffic_sign, pattern, substitude)
    if n > 0 then
      -- TODO: add to todo list
      return stripWhitespaces(val)
    end
  end

  -- Discard everything else
  return nil
end
