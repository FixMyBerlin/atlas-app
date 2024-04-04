package.path = package.path .. ";/app/process/helper/?.lua"
require('DeriveSurface')

print('=== Test SurfaceDirect: correct surface_source, surface_confidence for tag ===')
local result = DeriveSurface({surface="asphalt"})
assert(result.surface == "asphalt")
assert(result.surface_source == "tag")
assert(result.surface_confidence == "high")

print('=== Test SurfaceDirect: correct surface_source, surface_confidence for nil ===')
local result = DeriveSurface({})
assert(result.surface == nil)
assert(result.surface_source == nil)
assert(result.surface_confidence == nil)
