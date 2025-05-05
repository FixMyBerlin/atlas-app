describe("`result_tags_roads`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
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
    assert.are.equal(result.minzoom, 0)
    assert.are.equal(result.tags.highway, input_object.tags.highway)
    assert.are.equal(result.tags.osm_mapillary, nil)
  end)
end)
