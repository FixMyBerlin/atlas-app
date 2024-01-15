package.path = package.path .. ";app/process/helper/?.lua"
require("osm2pgsql")
require("ParseLength")


print('=== Test ParseLength ===')

local result = ParseLength("1.2")
assert(result == 1.2)

local result = ParseLength("120 cm")
assert(result == 1.2)

local result = ParseLength("foo")
assert(result == nil)

local result = ParseLength(nil)
assert(result == nil)
