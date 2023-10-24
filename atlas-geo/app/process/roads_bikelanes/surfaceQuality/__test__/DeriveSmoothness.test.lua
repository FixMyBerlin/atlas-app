package.path = package.path .. ";./app/process/roads_bikelanes/surfaceQuality/?.lua"
require('DeriveSmoothness')

print('=== Test DeriveSmoothnessFromSurface: surface "nil" returns "nil" ===')
local value, source, confidence, todo = DeriveSmoothnessFromSurface(nil)
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
assert(todo == "Please add surface=*")

print('=== Test DeriveSmoothnessFromSurface: surface "unknown_typo" returns "nil" ===')
local value, source, confidence, todo = DeriveSmoothnessFromSurface("unknown_typo")
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
assert(todo ~= nil)

print('=== Test DeriveSmoothnessFromSurface: surface "dirt" returns "bad" ===')
local value, source, confidence, todo = DeriveSmoothnessFromSurface("dirt")
assert(value == "bad")
assert(source == "surface_to_smoothness")
assert(confidence == "medium")
assert(todo == nil)

print('=== Test DeriveSmoothnessFromSurface: surface weird value returns "bad" ===')
local value, source, confidence, todo = DeriveSmoothnessFromSurface("sett;paving_stones;cobblestone:flattened")
assert(value == "bad")
assert(source == "surface_to_smoothness")
assert(confidence == "medium")
assert(todo ~= nil)

-- TODO: DeriveSmoothnessFromMTBScale
-- TODO: DeriveSmoothnessFromTrackType
