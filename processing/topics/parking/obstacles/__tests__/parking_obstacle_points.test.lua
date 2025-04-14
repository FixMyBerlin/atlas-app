describe("`result_data`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("parking_obstacle_points")
  require("categorize_and_transform")
  require("Log")

  it('works', function()
    local input_object = {
      tags = {
        crossing = 'marked',
        mapillary = "123"
      },
      id = 1,
      type = 'node'
    }
    local results = categorize_and_transform(input_object)
    assert.are.equal(results.self.category, nil)

    local left_result = result_tags(results.left)
    assert.are.equal(left_result.id, "node/"..input_object.id.."/"..results.left.object._side)
    assert.are.equal(left_result.tags.perform_snap, results.left.category.perform_snap)
    assert.are.equal(type(left_result.meta.update_at), "string")
    assert.are.equal(left_result.minzoom, 0)
    assert.are.equal(left_result.tags.side, "left")
    assert.are.equal(left_result.tags.osm_mapillary, input_object.tags.mapillary)

    local right_result = result_tags(results.right)
    assert.are.equal(right_result.id, "node/"..input_object.id.."/"..results.right.object._side)
    assert.are.equal(right_result.tags.perform_snap, results.right.category.perform_snap)
    assert.are.equal(type(right_result.meta.update_at), "string")
    assert.are.equal(right_result.minzoom, 0)
    assert.are.equal(right_result.tags.side, "right")
    assert.are.equal(right_result.tags.osm_mapillary, input_object.tags.mapillary)
  end)
end)
