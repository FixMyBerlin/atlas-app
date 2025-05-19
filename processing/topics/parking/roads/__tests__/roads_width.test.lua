package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
require("road_width")

describe("road_width", function()
  it("returns fallback width for unknown highway types", function()
    local tags = { highway = "unknown" }
    assert.are.equal(10, road_width(tags))
  end)

  it("returns specific width for known highway types", function()
    local tags = { highway = "primary" }
    assert.are.equal(17, road_width(tags))
  end)

  it("applies oneway logic correctly", function()
    local tags = { highway = "secondary", oneway = "yes" }
    assert.are.equal(10, road_width(tags)) -- 15 * 2/3 = 10
  end)

  it("ignores oneway logic for non-oneway roads", function()
    local tags = { highway = "secondary", oneway = "no" }
    assert.are.equal(15, road_width(tags))
  end)

  it("handles missing highway tag gracefully", function()
    local tags = {}
    assert.are.equal(10, road_width(tags))
  end)
end)
