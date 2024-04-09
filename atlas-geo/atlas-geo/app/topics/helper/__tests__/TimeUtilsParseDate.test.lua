package.path = package.path .. ";/app/topics/helper/?.lua"
require("TimeUtils")

print('=== Test TimeUtils ParseCheckDate ===')

-- Valid
local result = ParseCheckDate("2023-12-01")
assert(result == os.time({year = "2023", month = "12", day = "01"}))

-- Call with `nil`
local result = ParseCheckDate(nil)
assert(result == nil)

-- Invalid format
local result = ParseCheckDate("23-12-01")
assert(result == nil)

-- Invalid format
local result = ParseCheckDate("12-01-2023")
assert(result == nil)

-- Invalid format but still works…
local result = ParseCheckDate("2023-12-00")
assert(result == os.time({year = "2023", month = "12", day = "00"}))

-- Invalid format
local result = ParseCheckDate("2023-12")
assert(result == nil)

-- Invalid format
local result = ParseCheckDate("2023")
assert(result == nil)

-- Invalid format
local result = ParseCheckDate("foo")
assert(result == nil)
