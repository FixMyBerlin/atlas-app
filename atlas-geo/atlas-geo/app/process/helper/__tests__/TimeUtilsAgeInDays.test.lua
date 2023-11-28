package.path = package.path .. ";app/process/helper/?.lua"
require("TimeUtils")

print('=== Test TimeUtils AgeInDays ===')

-- Valid Nil = Nil
local result = AgeInDays(nil)
assert(result == nil)

-- Valid Date = Time
-- Format: https://www.lua.org/pil/22.1.html
local today = os.date("*t")
local yesterday = os.date("%Y-%m-%d", os.time({ year = today.year, month = today.month, day = tonumber(today.day) - 1 }))
local input = ParseDate(yesterday)
local result = AgeInDays(input)
assert(result == 1)

-- Invalid = Nil
local result = AgeInDays("foo")
assert(result == nil)
