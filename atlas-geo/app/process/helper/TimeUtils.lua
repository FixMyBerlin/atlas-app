-- return the number of days that passed since a given timestamp in unix format
-- currently everything >730 is considered outdated
function AgeInDays(timestamp) 
    local diff = os.clock() - timestamp
    return math.floor(diff / (3600 * 24))
end

-- given a date in YYYY-MM-DD return the respective unix timestamp
function ParseDate(date)
    local format = "(%d+)-(%d+)-(%d+)"
    local year, month, day = date:match(format)
    return os.time({year = year, month = month, day = day})
end