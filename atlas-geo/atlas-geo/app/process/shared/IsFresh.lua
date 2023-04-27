package.path = package.path .. ";./app/process/helper/?.lua"
require("CheckDataWithinYears")

-- * @desc Categoize the fresshnews of data.
--    If present, use `date_tag` (eg. `check_date:lit`) => high confidence.
--    Fall back to `object.timestamp` => low confidence.
-- * @returns
--   `dest` with freshness-tags added to it.
--   If no parameter was provided a new object gets created.
--   `isFreshKey` a table of keys to use for FilterTags
function IsFresh(object, date_tag, dest, postfix)
  dest = dest or {}

  local date = os.date('!%Y-%m-%d', object.timestamp)
  local source = "update_at"

  if object.tags[date_tag] then
    date = object.tags[date_tag]
    source = "check_date"
  end

  -- Freshness of data, see documentation
  local withinYears = CheckDataWithinYears(date, 2)

  local fresh_key = table.concat({ "fresh", postfix }, "_")
  if withinYears.result then
    dest[fresh_key] = "fresh_" .. source
  else
    dest[fresh_key] = "outdated_" .. source
  end

  local fresh_age_key = table.concat({ "fresh_age_days", postfix }, "_")
  dest[fresh_age_key] = withinYears.diffDays

  local isFreshKeys = { fresh_key, fresh_age_key }

  return dest, isFreshKeys
end
