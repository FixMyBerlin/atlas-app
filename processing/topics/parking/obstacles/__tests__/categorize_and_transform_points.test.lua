describe("`categorize_and_transform_points`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("categorize_and_transform_points")
  require("Log")

  it('no category matches', function()
    local tags = {
      ["natural"] = 'tree',
      ["obstacle:parking"] = 'yes',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(type(result.self), "table")
    assert.are.equal(result.self.category.id, 'tree')
    assert.are.equal(result.self.object._side, 'self')

    assert.are.equal(result.left.category, nil)
    assert.are.equal(result.right.category, nil)
  end)

  it('category matches and source is "left"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'left',
      ["any"] = 'tag',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(result.self.category, nil)

    assert.are.equal(type(result.left), "table")
    assert.are.equal(result.left.category.id, 'crossing_kerb_extension')
    assert.are.equal(result.left.object._side, 'left')
    assert.are.equal(result.left.object.tags.any, 'tag')

    assert.are.equal(result.right.category, nil)
  end)

  it('category matches and source is "both"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'both',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(result.self.category, nil)

    assert.are.equal(type(result.left), "table")
    assert.are.equal(result.left.category.id, 'crossing_kerb_extension')
    assert.are.equal(result.left.object._side, 'left')
    assert.are.equal(result.left.object.tags["crossing:kerb_extension"], 'left')

    assert.are.equal(type(result.right), "table")
    assert.are.equal(result.right.category.id, 'crossing_kerb_extension')
    assert.are.equal(result.right.object._side, 'right')
    assert.are.equal(result.right.object.tags["crossing:kerb_extension"], 'right')
  end)

  it('category only matches for left|right|both values"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'unknown',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(result.self.category, nil)
    assert.are.equal(result.left.category, nil)
    assert.are.equal(result.right.category, nil)
  end)

  it('two categories match one per side; if the buffer is the same, the first in the class wins', function()
    local tags = {
      ["crossing:kerb_extension"] = 'left',
      ["crossing:buffer_marking"] = 'both',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(result.self.category, nil)

    assert.are.equal(type(result.left), "table")
    assert.are.equal(result.left.category.id, 'crossing_buffer_marking')
    assert.are.equal(result.left.category.perform_buffer, 3)
    assert.are.equal(result.left.object._side, 'left')
    assert.are.equal(result.left.object.tags["crossing:kerb_extension"], 'left')
    assert.are.equal(result.left.object.tags["crossing:buffer_marking"], 'left')

    assert.are.equal(type(result.right), "table")
    assert.are.equal(result.right.category.id, 'crossing_buffer_marking')
    assert.are.equal(result.right.category.perform_buffer, 3)
    assert.are.equal(result.right.object._side, 'right')
    assert.are.equal(result.right.object.tags["crossing:kerb_extension"], 'left')
    assert.are.equal(result.right.object.tags["crossing:buffer_marking"], 'right')
  end)

  it('two categories match and the largest buffer wins', function()
    local tags = {
      ["crossing"] = 'marked',
      ["crossing:markings"] = 'zebra',
    }
    local result = categorize_and_transform_points({ tags = tags })
    assert.are.equal(result.self.category, nil)

    assert.are.equal(type(result.left), "table")
    assert.are.equal(result.left.category.id, 'crossing_zebra')
    assert.are.equal(result.left.category.perform_buffer, 4.5)
    assert.are.equal(result.left.object._side, 'left')

    assert.are.equal(type(result.right), "table")
    assert.are.equal(result.right.category.id, 'crossing_zebra')
    assert.are.equal(result.right.category.perform_buffer, 4.5)
    assert.are.equal(result.right.object._side, 'right')
  end)
end)
