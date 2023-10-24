package.path = package.path .. ";./app/process/roads_bikelanes/surfaceQuality/?.lua;./app/process/helper/?.lua"
require("NormalizeSmoothness")

print('=== Test NormalizeSmoothness: normalization works for "good"=>"good" ===')
local value, source, confidence = NormalizeSmoothness("good")
assert(value == "good")
assert(source == "tag")
assert(confidence == "high")

print('=== Test NormalizeSmoothness: normalization works for "very_good"=>"excellent" ===')
local value, source, confidence = NormalizeSmoothness("very_good")
assert(value == "excellent")
assert(source == "tag_normalized")
assert(confidence == "high")

print('=== Test NormalizeSmoothness: nil returns nil ===')
local value, source, confidence = NormalizeSmoothness(nil)
assert(value == nil)
assert(source == nil)
assert(confidence == nil)

print('=== Test NormalizeSmoothness: typos return nil ===')
local value, source, confidence = NormalizeSmoothness("typo")
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
