package.path = package.path .. ";app/process/helper/?.lua"
require("CheckDataWithinYears")
require("PrintTable")

local debug = true
print('=== Test CheckDataWithinYears ===')
if (debug) then print('=== Debug true ===') end

-- Format: https://www.lua.org/pil/22.1.html
local today = os.date("*t")

local desc = "check_date yesterday returns the number of days of this month because we always compare with the beginning of the month"
local yesterday = os.date("%Y-%m-%d", os.time({ year = today.year, month = today.month, day = tonumber(today.day) - 1 }))
local tags = { ["check_date:foo"] = yesterday }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == true)
assert(withinYears.diffDays == today.day - 1)

local desc = "check_date last year is within range, diffDays somewhere > 300 (the excat values depents on the current month"
local lastYear = os.date("%Y-%m-%d", os.time({ year = tonumber(today.year) - 1, month = today.month, day = today.day }))
local tags = { ["check_date:foo"] = lastYear }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == true)
assert(withinYears.diffDays > 300)

local desc = "check_date 2 year is (already/just) outside of our range"
local twoYears = os.date("%Y-%m-%d", os.time({ year = tonumber(today.year) - 2, month = today.month, day = today.day }))
local tags = { ["check_date:foo"] = twoYears }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == false)

local desc = "check_date 3 year is outside of our range"
local threeYears = os.date("%Y-%m-%d", os.time({ year = tonumber(today.year) - 3, month = today.month, day = today.day }))
local tags = { ["check_date:foo"] = threeYears }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == false)

local desc = "Just a year will return `false` every time"
local tags = { ["check_date:foo"] = tostring(tonumber(today.year) - 1) }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == false)

local desc = "No check_date will return `false` every time"
local tags = { ["foo"] = "bar" }
local withinYears = CheckDataWithinYears("foo", tags)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == false)

local desc = "check_date 3 year compared to 4 years is within range"
local threeYears = os.date("%Y-%m-%d", os.time({ year = tonumber(today.year) - 3, month = today.month, day = today.day }))
local tags = { ["check_date:foo"] = threeYears }
local withinYears = CheckDataWithinYears("foo", tags, 4)
if (debug) then PrintTableWithHeadline(withinYears, desc) end
assert(withinYears.result == true)
assert(withinYears.diffDays > 365 * 3)
