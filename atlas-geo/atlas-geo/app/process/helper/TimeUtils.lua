-- return the number of days that passed since a given timestamp in unix format
-- currently everything >730 is considered outdated
function AgeInDays(timestamp)
  -- Return nil for all that is not a number
  if type(timestamp) ~= "number" or tonumber(timestamp) == nil then
    return nil
  end

  local diff = os.time() - timestamp
  return math.floor(diff / (3600 * 24))
end

-- given a date in YYYY-MM-DD return the respective unix timestamp
function ParseDate(date)
  local format = "(%d+)-(%d+)-(%d+)"
  local year, month, day = date:match(format)

  local success, result = pcall(function()
    return os.time({ year = year, month = month, day = day })
  end)

  if success then
    return result
  else
    return nil
  end
end
