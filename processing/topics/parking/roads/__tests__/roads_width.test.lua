
describe("road_width", function()
  package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
  require("road_width")
  require("osm2pgsql")

  it("returns fallback width for unknown highway types", function()
    local tags = { highway = "unknown" }
    local width, confidence, source = road_width(tags)
    assert(width == 10)
    assert(confidence == 'medium')
    assert(source == 'highway_default')
  end)

  it("returns specific width for known highway types", function()
    local tags = { highway = "primary" }
    local width, confidence, source = road_width(tags)
    assert(width == 17)
    assert(confidence == 'medium')
    assert(source == 'highway_default')
  end)

  it("applies oneway logic correctly", function()
    local tags = { highway = "secondary", oneway = "yes" }
    local width, confidence, source = road_width(tags)
    assert(width == 15 * 2/3) -- = 10
    assert(confidence == 'medium')
    assert(source == 'highway_default_and_oneway')
  end)

  it("ignores oneway logic for non-oneway roads", function()
    local tags = { highway = "secondary", oneway = "no" }
    local width, confidence, source = road_width(tags)
    assert(width == 15)
    assert(confidence == 'medium')
    assert(source == 'highway_default')
  end)

  it("handles missing highway tag gracefully", function()
    local tags = {}
    local width, confidence, source = road_width(tags)
    assert(width == 10)
    assert(confidence == 'medium')
    assert(source == 'highway_default')
  end)

  it("returns high confidence and tag source when tags.width is present", function()
    local tags = { width = "12.5", highway = "primary" }
    local width, confidence, source = road_width(tags)
    assert(width == 12.5)
    assert(confidence == 'high')
    assert(source == 'tag')
  end)
end)
