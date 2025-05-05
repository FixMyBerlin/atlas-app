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
    assert.are.equal("way/"..input_object.id, result.id)
    assert.are.equal("string", type(result.meta.update_at))
    assert.are.equal(0, result.minzoom)
    assert.are.equal(input_object.tags.highway, result.tags.highway)
    assert.are.equal(input_object.tags.mapillary, result.tags.osm_mapillary)
  end)
end)
