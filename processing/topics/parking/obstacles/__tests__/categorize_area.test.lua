describe("`categorize_area`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
  require("categorize_area")
  require("result_tags_obstacles")
  require("Log")
  require("osm2pgsql")

  it('no category matches', function()
    local tags = {
      ["amenity"] = 'bicycle_parking',
    }
    local result = categorize_area({ tags = tags })
    assert.are.equal(result.category, nil)
    assert.are.equal(result.object, nil)
  end)

  it('matches bicycle parkings', function()
    local tags = {
      ["amenity"] = 'bicycle_parking',
      ["position"] = 'lane',
      ["capacity"] = '10',
      ["everything"] = 'is_copied',
    }
    local result = categorize_area({ tags = tags })
    assert.are.equal(type(result.category), "table")
    assert.are.equal(result.category.id, "bicycle_parking")

    assert.are.equal(type(result.object), "table")
    assert.are.equal(result.object.tags.capacity, "10")
    assert.are.equal(result.object.tags.everything, "is_copied")
  end)

  it('works with result_tags', function()
    local input_object = {
      tags = {
        ["amenity"] = 'bicycle_parking',
        ["position"] = 'lane',
        ["capacity"] = '10',
        ["not_copied"] = 'not_in_further_tags',
        ["mapillary"] = '123',
      },
      id = 1,
      type = 'way'
    }
    local result = categorize_area(input_object)
    local result_tags = result_tags_obstacles(result)
    assert.are.equal(result_tags.id, "way/"..input_object.id.."/self")
    assert.are.equal(result_tags.tags.perform_snap, result.category.perform_snap)
    assert.are.equal(type(result_tags.meta.update_at), "string")
    assert.are.equal(result_tags.tags.osm_mapillary, input_object.tags.mapillary)
    assert.are.equal(result_tags.tags.not_copied, nil)
  end)

  it('parklet', function()
    local tags = {
      ["leisure"] = 'parklet',
    }
    local result = categorize_area({ tags = tags })
    assert.are.equal(result.category.id, "parklet")
    assert.are.equal(type(result.object), "table")
  end)

  it('road_marking_restricted_area', function()
    local input_object = {
      tags = {
        ["area:highway"] = 'prohibited',
      },
      id = 1,
      type = 'way'
    }
    local result = categorize_area(input_object)
    local result_tags = result_tags_obstacles(result)
    assert.are.equal(result.category.id, "road_marking_restricted_area")
    assert.are.equal(type(result.object), "table")
    assert.are.equal(result_tags.id, "way/"..input_object.id.."/self")
  end)
end)
