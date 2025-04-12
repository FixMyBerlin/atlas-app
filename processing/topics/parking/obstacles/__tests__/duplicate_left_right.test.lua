describe("`duplicate_left_right`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("osm2pgsql")
  require("duplicate_left_right")
  local inspect = require('inspect')

  it('no category matches', function()
    local tags = {
      ["natural"] = 'tree',
      ["obstacle:parking"] = 'yes',
    }
    local result = duplicate_left_right({ tags = tags })
    assert.are.equal(#result, 1)
    assert.are.equal(result[1]._transformed, nil)
    assert.are.equal(result[1].tags.natural, "tree")
  end)

  it('category matches and source is "left"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'left',
      ["any"] = 'tag',
    }
    local result = duplicate_left_right({ tags = tags })
    assert.are.equal(#result, 1)
    assert.are.equal(result[1]._transformed, 'left')
    assert.are.same(result[1].tags.any, "tag")
  end)

  it('category matches and source is "both"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'both',
    }
    local result = duplicate_left_right({ tags = tags })
        assert.are.equal(#result, 2)
    print('xx1'..inspect(result[1]))
    print('xx2'..inspect(result[2]))
    assert.are.equal(result[1]._transformed, 'left')
    assert.are.equal(result[2]._transformed, 'right')
    assert.are.same(result[1].tags["crossing:kerb_extension"], "left")
    assert.are.same(result[2].tags["crossing:kerb_extension"], "right")
  end)

  it('category matches and source is "something_not_left|right|both"', function()
    local tags = {
      ["crossing:kerb_extension"] = 'unknown',
    }
    local result = duplicate_left_right({ tags = tags })
    assert.are.equal(#result, 1)
    assert.are.equal(result[1]._transformed, nil)
    assert.are.equal(result[1].tags["crossing:kerb_extension"], 'unknown')
    assert.are.same(result[1].tags, tags)
  end)

  it('two categories match but only the first is transformed', function()
    local tags = {
      ["crossing:kerb_extension"] = 'both',
      ["crossing:buffer_marking"] = 'both',
    }
    local result = duplicate_left_right({ tags = tags })
    assert.are.equal(#result, 2)
    assert.are.equal(result[1]._transformed, 'left')
    assert.are.equal(result[2]._transformed, 'right')
    -- Beacause the buffer_marking is above the kerb_extension in the list of categories
    assert.are.equal(result[1].tags['crossing:kerb_extension'], 'both')
    assert.are.equal(result[1].tags['crossing:buffer_marking'], 'left')
    assert.are.equal(result[2].tags['crossing:kerb_extension'], 'both')
    assert.are.equal(result[2].tags['crossing:buffer_marking'], 'right')
  end)
end)
