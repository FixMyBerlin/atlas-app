package.path = package.path .. ";/processing/topics/helper/?.lua"
require("DeriveSmoothness")

print('=== Test DeriveSmoothness: normalization works for "good"=>"good" ===')
local result = DeriveSmoothness({smoothness="good"})
assert(result.smoothness == "good")
assert(result.smoothness_source == "tag")
assert(result.smoothness_confidence == "high")

print('=== Test DeriveSmoothness: normalization works for "very_good"=>"excellent" ===')
local result = DeriveSmoothness({smoothness="very_good"})
assert(result.smoothness == "excellent")
assert(result.smoothness_source == "tag_normalized")
assert(result.smoothness_confidence == "high")

print('=== Test DeriveSmoothness: nil returns nil ===')
local result = DeriveSmoothness({})
assert(result.smoothness == nil)
assert(result.smoothness_source == nil)
assert(result.smoothness_confidence == nil)

print('=== Test DeriveSmoothness: typos return nil ===')
local result = DeriveSmoothness({smoothness="typo"})
assert(result.smoothness == nil)
assert(result.smoothness_source == nil)
assert(result.smoothness_confidence == nil)
