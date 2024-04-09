package.path = package.path .. ";/app/topics/helper/?.lua"
require("TimeUtils")

print('=== Test TimeUtils AgeInDays ===')

-- Valid Nil = Nil
local result = AgeInDays(nil)
assert(result == nil)

-- Valid Date = Time
-- Format: https://www.lua.org/pil/22.1.html
local today = os.time()
local yesterday = today - 3600 * 24 * 1
local result = AgeInDays(yesterday)
assert(result == 1)

-- Invalid = Nil
local result = AgeInDays("foo")
assert(result == nil)
