require("IsTermInString")

-- Cleanup spaces where none should be
local function CleanupSpaces(string)
  local cleaned = string
  if IsTermInString(', ', cleaned) then
    cleaned = cleaned.gsub(cleaned, ', ', ',')
  end
  if IsTermInString('; ', cleaned) then
    cleaned = cleaned.gsub(cleaned, '; ', ';')
  end
  return cleaned
end

-- * @desc Cleanup the `traffic_sign=*` tag
-- * @returns string
function SanitizeTrafficSign(traffic_sign_value)
  if traffic_sign_value == nil then
    return nil
  end

  -- Rename
  -- Docs: gsub with "^" targets beginning of string
  if traffic_sign_value == "no" then
    return "none"
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'DE: ') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^DE: ', 'DE:'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'DE2') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^DE2', 'DE:2'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'DE1') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^DE1', 'DE:1'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'D:') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^D:', 'DE:'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'de:') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^de:', 'DE:'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, 'DE.') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^DE.', 'DE:'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, '2') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^2', 'DE:2'))
  end
  if osm2pgsql.has_prefix(traffic_sign_value, '10') then
    return CleanupSpaces(string.gsub(traffic_sign_value, '^10', 'DE:10'))
  end

  -- Allows
  if osm2pgsql.has_prefix(traffic_sign_value, 'DE:') then
    return CleanupSpaces(traffic_sign_value)
  end
  if traffic_sign_value == "none" then
    return traffic_sign_value
  end

  -- Disallow everything else
  return nil
end
