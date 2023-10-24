package.path = package.path .. ";app/process/helper/?.lua"
require("TimeUtils")

print('=== Test TimeUtils ParseDate ===')

-- Valid
local result = ParseDate("2023-12-01")
assert(result == os.time({year = "2023", month = "12", day = "01"}))

-- Invalid format
local result = ParseDate("23-12-01")
assert(result == nil)

-- Invalid format
local result = ParseDate("12-01-2023")
assert(result == nil)

-- Invalid format but still works…
local result = ParseDate("2023-12-00")
assert(result == os.time({year = "2023", month = "12", day = "00"}))

-- Invalid format
local result = ParseDate("2023-12")
assert(result == nil)

-- Invalid format
local result = ParseDate("2023")
assert(result == nil)

-- Invalid format
local result = ParseDate("foo")
assert(result == nil)
