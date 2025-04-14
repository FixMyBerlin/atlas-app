describe("`categorize_area`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("categorize_area")
  require("result_tags")
  require("Log")

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
    local result_tags = result_tags(result)
    assert.are.equal(result_tags.id, "way/"..input_object.id.."/self")
    assert.are.equal(result_tags.tags.perform_snap, result.category.perform_snap)
    assert.are.equal(type(result_tags.meta.update_at), "string")
    assert.are.equal(result_tags.minzoom, 0)
    assert.are.equal(result_tags.tags.osm_mapillary, input_object.tags.mapillary)
    assert.are.equal(result_tags.tags.not_copied, nil)
  end)
end)
