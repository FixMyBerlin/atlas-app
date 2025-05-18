describe("`result_tags_obstacles`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
  require("result_tags_obstacles")
  require("categorize_and_transform_points")
  require("osm2pgsql")
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
    local results = categorize_and_transform_points(input_object)
    assert.are.equal(results.self.category, nil)

    local left_result = result_tags_obstacles(results.left)
    assert.are.equal(left_result.id, "node/"..input_object.id.."/"..results.left.object.tags.side)
    assert.are.equal(left_result.tags.perform_snap, results.left.category.perform_snap)
    assert.are.equal(type(left_result.meta.update_at), "string")
    assert.are.equal(left_result.tags.category, "crossing_marked")
    assert.are.equal(left_result.tags.side, "left")
    assert.are.equal(left_result.tags.osm_mapillary, input_object.tags.mapillary)

    local right_result = result_tags_obstacles(results.right)
    assert.are.equal(right_result.id, "node/"..input_object.id.."/"..results.right.object.tags.side)
    assert.are.equal(right_result.tags.perform_snap, results.right.category.perform_snap)
    assert.are.equal(type(right_result.meta.update_at), "string")
    assert.are.equal(right_result.tags.category, "crossing_marked")
    assert.are.equal(right_result.tags.side, "right")
    assert.are.equal(right_result.tags.osm_mapillary, input_object.tags.mapillary)
  end)

  it('check tags, tags_cc', function()
    local input_object = {
      tags = {
        ["obstacle:parking"] = 'yes',
        natural = 'tree_stump',
        mapillary = "123",
        ref = "007",
      },
      id = 1,
      type = 'node'
    }
    local results = categorize_and_transform_points(input_object)
    local self_result = result_tags_obstacles(results.self)
    assert.are.equal(self_result.tags.osm_mapillary, "123")
    assert.are.equal(self_result.tags.osm_ref, "007")
    assert.are.equal(self_result.tags.natural, "tree_stump")

    assert.are.equal(next(results.left) == nil, true)
    assert.are.equal(next(results.right) == nil, true)
  end)


  it('handels buffer for two wheel parking', function()
    local input_object = {
      tags = {
        ["amenity"] = 'bicycle_parking',
        ["position"] = 'lane',
        ["capacity"] = '10',
        ["capacity:cargo"] = '5',
      },
      id = 1,
      type = 'node'
    }
    local results = categorize_and_transform_points(input_object)
    local self_result = result_tags_obstacles(results.self)
    assert.are.equal(self_result.tags.capacity, 5)
    assert.are.equal(self_result.tags["capacity:cargo"], 5)
    assert.are.equal(self_result.tags.perform_buffer, 10 / 2 * 1.6)

    assert.are.equal(next(results.left) == nil, true)
    assert.are.equal(next(results.right) == nil, true)
  end)
end)
