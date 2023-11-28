package.path = package.path .. ";./app/process/shared/?.lua;./app/process/helper/?.lua"
require("DeriveSmoothness")

print('=== Test DeriveSmoothness: normalization works for "good"=>"good" ===')
local value, source, confidence = DeriveSmoothness({smoothness="good"})
assert(value == "good")
assert(source == "tag")
assert(confidence == "high")

print('=== Test DeriveSmoothness: normalization works for "very_good"=>"excellent" ===')
local value, source, confidence = DeriveSmoothness({smoothness="very_good"})
assert(value == "excellent")
assert(source == "tag_normalized")
assert(confidence == "high")

print('=== Test DeriveSmoothness: nil returns nil ===')
local value, source, confidence = DeriveSmoothness({})
assert(value == nil)
assert(source == nil)
assert(confidence == nil)

print('=== Test DeriveSmoothness: typos return nil ===')
local value, source, confidence = DeriveSmoothness({smoothness="typo"})
assert(value == nil)
assert(source == nil)
assert(confidence == nil)
