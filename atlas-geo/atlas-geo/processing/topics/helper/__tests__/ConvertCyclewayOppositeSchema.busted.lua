describe("ConvertCyclewayOppositeSchema", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("CompareTables")
  require("ConvertCyclewayOppositeSchema")
  require("osm2pgsql")
  require("DeepCopy")
  describe('=== Do nothing ===', function()
    local originalTags = { ["cycleway"] = "lane" }
    local tags = DeepCopy(originalTags)
    ConvertCyclewayOppositeSchema(tags)
    assert.are.same(tags, originalTags)
  end)
  describe('=== Do nothing ===', function()
    local originalTags = { ["cycleway"] = "lane" }
    local tags = DeepCopy(originalTags)
    ConvertCyclewayOppositeSchema(tags)
    assert.are.same(tags, originalTags)
  end)
  describe('=== Handle opposite ===', function()
    local tags = { ["cycleway"] = "opposite",["oneway"] = "yes" }
    local expectedResult = { ["cycleway"] = "no",["oneway:bicycle"] = "no",["oneway"] = "yes" }
    ConvertCyclewayOppositeSchema(tags)
    assert.are.same(tags, expectedResult)
  end)
  describe('=== Handle opposite_lane ===', function()
    local tags = { ["cycleway"] = "opposite_lane",["oneway"] = "yes" }
    local expectedResult = {
      ["cycleway:right"] = "no",
      ["cycleway:left"] = "lane",
      ["oneway:bicycle"] = "no",
      ["oneway"] = "yes",
    }
    ConvertCyclewayOppositeSchema(tags)
    assert.are.same(tags, expectedResult)
  end)
  describe('=== Handle opposite_track ===', function()
    local tags = { ["cycleway"] = "opposite_track",["oneway"] = "yes" }
    local expectedResult = {
      ["cycleway:right"] = "no",
      ["cycleway:left"] = "track",
      ["oneway:bicycle"] = "no",
      ["oneway"] = "yes",
    }
    ConvertCyclewayOppositeSchema(tags)
    assert.are.same(tags, expectedResult)
  end)
end)
