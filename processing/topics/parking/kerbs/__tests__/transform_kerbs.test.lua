describe("`result_tags_kerbs`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/kerbs/helper/?.lua"
  require("result_tags_kerbs")
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
      _side = 'left'
    }
    local result = result_tags_kerbs(input_object)
    assert.are.equal(result.id, "way/"..input_object.id.."/"..result.tags.side)
    assert.are.equal(type(result.meta.update_at), "string")
    assert.are.equal(result.minzoom, 0)
    assert.are.equal(result.tags.side, input_object._side)
    assert.are.equal(result.tags.osm_mapillary, input_object.tags.mapillary)
  end)
end)
