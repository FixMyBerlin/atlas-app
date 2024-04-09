package.path = package.path .. ";/app/topics/helper/?.lua"
require("osm2pgsql")
require("ParseLength")


print('=== Test ParseLength ===')

local result = ParseLength("1.2")
assert(result == 1.2)

local result = ParseLength("120 cm")
assert(result == 1.2)
assert(result == 1.2)

local result = ParseLength("120cm")
assert(result == 1.2)

local result = ParseLength("120.1cm")
assert(math.abs(result - 1.201) < 0.00001) -- Weird floating point precision issue

local result = ParseLength("120 cm Weg")
assert(result == nil)

local result = ParseLength("1.2m")
assert(result == 1.2)

local result = ParseLength("1.2 m")
assert(result == 1.2)

local result = ParseLength("1,2 m")
assert(result == nil)

local result = ParseLength("1.2 km")
assert(result == 1200)

-- miles and feet example see https://wiki.openstreetmap.org/wiki/Key:width#Examples
local result = ParseLength("0.6 mi")
assert(result == nil)

local result = ParseLength("16'")
assert(result == nil)

local result = ParseLength("16'3\"")
assert(result == nil)

local result = ParseLength("foo")
assert(result == nil)

local result = ParseLength(nil)
assert(result == nil)
