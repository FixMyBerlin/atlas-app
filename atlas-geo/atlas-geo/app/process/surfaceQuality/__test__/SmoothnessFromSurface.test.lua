package.path = package.path .. ";./app/process/surfaceQuality/?.lua"
require('SmoothnessFromSurface')

print('=== Test SmoothnessFromSurface: surface "nil" returns "nil" ===')
local value, source, confidence, todo = SmoothnessFromSurface(nil)
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
assert(todo == "Please add surface=*")

print('=== Test SmoothnessFromSurface: surface "unknown_typo" returns "nil" ===')
local value, source, confidence, todo = SmoothnessFromSurface("unknown_typo")
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
assert(todo ~= nil)

print('=== Test SmoothnessFromSurface: surface "dirt" returns "bad" ===')
local value, source, confidence, todo = SmoothnessFromSurface("dirt")
assert(value == "bad")
assert(source == "surface_to_smoothness")
assert(confidence == "medium")
assert(todo == nil)

print('=== Test SmoothnessFromSurface: surface weird value returns "bad" ===')
local value, source, confidence, todo = SmoothnessFromSurface("sett;paving_stones;cobblestone:flattened")
assert(value == "bad")
assert(source == "surface_to_smoothness")
assert(confidence == "medium")
assert(todo ~= nil)
