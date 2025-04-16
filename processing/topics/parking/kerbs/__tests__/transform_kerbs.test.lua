describe("`transform_kerbs`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/kerbs/helper/?.lua"
  require("transform_kerbs")
  require("Log")

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
    local results = transform_kerbs(input_object)
    assert.are.equal(#results, 2)
    assert.are.equal(results[1].id, input_object.id)
    assert.are.equal(results[1]._side, "left")
    assert.are.equal(results[2].id, input_object.id)
    assert.are.equal(results[2]._side, "right")
  end)
end)
