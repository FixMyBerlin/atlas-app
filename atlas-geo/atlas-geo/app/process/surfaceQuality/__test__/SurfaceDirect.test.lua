package.path = package.path .. ";app/process/surface_smoothness/?.lua"
require('SurfaceDirect')

print('=== Test SurfaceDirect: correct source, confidence for tag ===')
local value, source, confidence = SurfaceDirect("asphalt")
assert(value == "asphalt")
assert(source == "tag")
assert(confidence == "high")

print('=== Test SurfaceDirect: correct source, confidence for nil ===')
local value, source, confidence = SurfaceDirect(nil)
assert(value == nil)
assert(source == "nothing_found")
assert(confidence == "nothing_found")
