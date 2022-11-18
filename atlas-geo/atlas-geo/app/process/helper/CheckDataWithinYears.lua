-- This helper takes a few shortcuts. But since precision is not that important, those should be fine.
-- - We ignore the check_date-_day_ since that could be missing ("2022-01" is a valid value in OSM when exact day is unkown).
-- - Minimum data of check_date is "yyyy-mm"
-- - We can only compare full years (for now)
-- - Default is 2 years; the exact behavior on the edges is not explitly coded/decided

-- * @desc CheckDataWithinYears(dateValue, [_opt_ 2 (default)])
-- * @returns `{ result = boolean, diffDays = int | nil }`
function CheckDataWithinYears(dateValue, years)
  local yearsToSubtract = years or 2
  local compareDays = yearsToSubtract * 365

  if not dateValue then
    return { result = false }
  end

  -- `2022-01<rest>`
  -- For simplicty, we skip the days.
  local checkDatePattern = "(%d+)-(%d+).*"
  local checkDateYear, checkDateMonth, _rest = dateValue:match(checkDatePattern)
  if not checkDateYear and not checkDateMonth then return { result = false } end

  local checkDateUnixtime = os.time({ year = checkDateYear, month = checkDateMonth, day = 1, hour = 12, min = 0, sec = 0 })

  local today = os.date("*t") -- format: table (object)
  local currentUnixtime = os.time({ year = today.year, month = today.month, day = today.day, hour = 12, min = 0, sec = 0 })

  local diffTime = currentUnixtime - checkDateUnixtime
  local diffDays = math.ceil(diffTime / 60 / 60 / 24)

  return { result = diffDays < compareDays, diffDays = diffDays }
end
