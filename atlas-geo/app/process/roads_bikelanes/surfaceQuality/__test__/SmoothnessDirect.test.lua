package.path = package.path .. ";./app/process/roads/surfaceQuality/?.lua;./app/process/helper/?.lua"
require("SmoothnessDirect")

print('=== Test SmoothnessDirect: normalization works for "good"=>"good" ===')
local value, source, confidence = SmoothnessDirect("good")
assert(value == "good")
assert(source == "tag")
assert(confidence == "high")

print('=== Test SmoothnessDirect: normalization works for "very_good"=>"excellent" ===')
local value, source, confidence = SmoothnessDirect("very_good")
assert(value == "excellent")
assert(source == "tag_normalized")
assert(confidence == "high")

print('=== Test SmoothnessDirect: nil returns nil ===')
local value, source, confidence = SmoothnessDirect(nil)
assert(value == nil)
assert(source == nil)
assert(confidence == nil)

print('=== Test SmoothnessDirect: typos return nil ===')
local value, source, confidence = SmoothnessDirect("typo")
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
