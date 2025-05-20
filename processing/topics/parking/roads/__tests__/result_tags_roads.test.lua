describe("`result_tags_roads`", function()
  require('init')
  require("result_tags_roads")
  require("Log")
  require('osm2pgsql')

  it('works', function()
    local input_object = {
      tags = {
        highway = 'service',
        serivce = "alley",
        mapillary = "123",
      },
      id = 1,
      type = 'way',
    }
    local result = result_tags_roads(input_object)
    assert.are.equal(result.id, "way/"..input_object.id)
    assert.are.equal(type(result.meta.update_at), "string")
    assert.are.equal(result.tags.highway, input_object.tags.highway)
    assert.are.equal(result.tags.osm_mapillary, input_object.tags.mapillary)
  end)

  it('width > offset', function()
    local input_object = {
      tags = {
        highway = 'service',
        serivce = "alley",
        width = "80",
      },
      id = 1,
      type = 'way',
    }
    local result = result_tags_roads(input_object)
    assert.are.equal(result.id, "way/"..input_object.id)
    assert.are.equal(type(result.meta.update_at), "string")
    assert.are.equal(result.tags.width, 80)
    assert.are.equal(result.tags.perform_offset_left, -40)
    assert.are.equal(result.tags.perform_offset_right, 40)
  end)
end)
