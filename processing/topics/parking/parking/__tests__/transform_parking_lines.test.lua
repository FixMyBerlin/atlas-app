describe("`transform_parking_lines`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/parking/helper/?.lua"
  require("transform_parking_lines")
  require("Log")
  require('osm2pgsql')

  it('works', function()
    local input_object = {
      tags = {
        highway = 'residential',
        ["parking:left"] = "lane",
        ["parking:right"] = "street_side",
        ["parking:both"] = "lane",
        ["parking:both:fee"] = "no",
        ["parking:both:orientation"] = "parallel",
      },
      id = 1,
      type = 'way',
    }
    local results = transform_parking_lines(input_object)

    local left = results[1]
    assert.are.equal(type(left), "table")
    assert.are.equal(left._side, "left")
    assert.are.equal(left.tags.fee, "no")
    assert.are.equal(left.tags.parking, "lane")

    local right = results[2]
    assert.are.equal(type(right), "table")
    assert.are.equal(right._side, "right")
    assert.are.equal(right.tags.fee, "no")
    assert.are.equal(right.tags.parking, "street_side")
  end)

  it('case one side', function()
    local input_object = {
      tags = {
        highway = 'residential',
        ["parking:left"] = "lane",
      },
      id = 1,
      type = 'way',
    }
    local results = transform_parking_lines(input_object)

    local left = results[1]
    assert.are.equal(type(left), "table")
    assert.are.equal(left._side, "left")
    assert.are.equal(left.tags.parking, "lane")

    local right = results[2]
    assert.are.equal(type(right), "nil")
  end)
end)
