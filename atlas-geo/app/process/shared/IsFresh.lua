function IsFresh(object, date_tag, dest)
    dest = dest or {}
    local date = os.date('!%Y-%m-%d', object.timestamp)
    local source = "update_at"
    if object.tags[date_tag] then
        date = object.tags[date_tag]
        source = "check_date"
    end
    -- Freshness of data, see documentation
    local withinYears = CheckDataWithinYears(date, 2)
    if withinYears.result then
        dest.fresh = "fresh_" .. source
    else
        dest.fresh = "outdated_" .. source
    end
    dest.fresh_age_days = withinYears.diffDays
    return dest
end
