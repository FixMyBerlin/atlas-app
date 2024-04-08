package.path = package.path .. ";/app/process/helper/?.lua"
require("CompareTables")
require("ConvertCyclewayOppositeSchema")
require("osm2pgsql")
require("DeepCopy")

print('=== Test ConvertCyclewayOppositeSchema: do nothing ===')
local originalTags = { ["cycleway"] = "lane" }
local tags = DeepCopy(originalTags)
ConvertCyclewayOppositeSchema(tags)
assert(CompareTables(originalTags, tags))

print('=== Test ConvertCyclewayOppositeSchema: handle opposite ===')
local originalTags = { ["cycleway"] = "opposite",["oneway"] = "yes" }
local tags = DeepCopy(originalTags)
local expectedResult = { ["cycleway"] = "no",["oneway:bicycle"] = "no",["oneway"] = "yes" }
ConvertCyclewayOppositeSchema(tags)
assert(CompareTables(tags, expectedResult))

print('=== Test ConvertCyclewayOppositeSchema: handle opposite_lane ===')
local originalTags = { ["cycleway"] = "opposite_lane",["oneway"] = "yes" }
local tags = DeepCopy(originalTags)
local expectedResult = {
  ["cycleway:right"] = "no",
  ["cycleway:left"] = "lane",
  ["oneway:bicycle"] = "no",
  ["oneway"] = "yes",
}
ConvertCyclewayOppositeSchema(tags)
assert(CompareTables(tags, expectedResult))

print('=== Test ConvertCyclewayOppositeSchema: handle opposite_track ===')
local originalTags = { ["cycleway"] = "opposite_track",["oneway"] = "yes" }
local tags = DeepCopy(originalTags)
local expectedResult = {
  ["cycleway:right"] = "no",
  ["cycleway:left"] = "track",
  ["oneway:bicycle"] = "no",
  ["oneway"] = "yes",
}
ConvertCyclewayOppositeSchema(tags)
assert(CompareTables(tags, expectedResult))
