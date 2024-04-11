describe("ConvertCyclewayOppositeSchema", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("CompareTables")
  require("ConvertCyclewayOppositeSchema")
  require("osm2pgsql")
  require("DeepCopy")

  it('should do nothing when cycleway is lane', function()
    local input = { ["cycleway"] = "lane" }
    ConvertCyclewayOppositeSchema(input)
    assert.are.same(input, input)
  end)

  it('should handle opposite when oneway is yes', function()
    local input = { ["cycleway"] = "opposite", ["oneway"] = "yes" }
    local expectedResult = { ["cycleway"] = "no", ["oneway:bicycle"] = "no", ["oneway"] = "yes" }
    ConvertCyclewayOppositeSchema(input)
    assert.are.same(input, expectedResult)
  end)

  it('should handle opposite_lane when oneway is yes', function()
    local input = { ["cycleway"] = "opposite_lane", ["oneway"] = "yes" }
    local expectedResult = {
      ["cycleway:right"] = "no",
      ["cycleway:left"] = "lane",
      ["oneway:bicycle"] = "no",
      ["oneway"] = "yes",
    }
    ConvertCyclewayOppositeSchema(input)
    assert.are.same(input, expectedResult)
  end)

  it('should handle opposite_track when oneway is yes', function()
    local input = { ["cycleway"] = "opposite_track", ["oneway"] = "yes" }
    local expectedResult = {
      ["cycleway:right"] = "no",
      ["cycleway:left"] = "track",
      ["oneway:bicycle"] = "no",
      ["oneway"] = "yes",
    }
    ConvertCyclewayOppositeSchema(input)
    assert.are.same(input, expectedResult)
  end)
end)
