describe("`transform_kerbs`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/parking/helper/?.lua"
  require("transform_parking_lines")
  require("result_tags_parking_lines")
  require("Log")
  require("osm2pgsql")

  it('works', function()
    local input_object = {
      tags = {
        highway = 'residential',
        mapillary = "123",
        ["parking:left:parking"] = 'lane',
      },
      id = 1,
      type = 'way',
    }
    local results = transform_parking_lines(input_object)
    local object_part = result_tags_parking_lines(results[1])

    assert.are.equal(object_part.id, "way/1/left")
    assert.are.equal(object_part.tags.side, "left")
    assert.are.equal(object_part.tags.parking, "lane")
    assert.are.equal(object_part.tags.osm_mapillary, input_object.tags.mapillary)

    assert.are.equal(results.right, nil)
  end)
end)
