package.path = package.path .. ";./app/process/shared/?.lua"
require('DeriveSurface')

print('=== Test SurfaceDirect: correct source, confidence for tag ===')
local value, source, confidence = DeriveSurface({surface="asphalt"})
assert(value == "asphalt")
assert(source == "tag")
assert(confidence == "high")

print('=== Test SurfaceDirect: correct source, confidence for nil ===')
local value, source, confidence = DeriveSurface({})
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
