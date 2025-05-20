require('init')
local tablex = require('pl.tablex')
require('Log')
require('transform_point_direction_tags')

describe('transform_point_direction_tags', function()

  it('has a key:right and removes direction for forward', function()
    local tags = { direction = 'forward', foo = 'bar', mykey = 'myvalue' }
    transform_point_direction_tags(tags, '_side_key_mykey')
    assert.are.equal(tags['_side_key_mykey'], 'right')
    assert.are.equal(tablex.size(tags), 4)
  end)

  it('has a key:left and removes direction for backward', function()
    local tags = { direction = 'backward', foo = 'bar', mykey = 2 }
    transform_point_direction_tags(tags, '_side_key_mykey')
    assert.are.equal(tags['_side_key_mykey'], 'left')
    assert.are.equal(tablex.size(tags), 4)
  end)

  it('has a key:both and removes direction for both', function()
    local tags = { direction = 'both', foo = 'bar', mykey = 3 }
    transform_point_direction_tags(tags, '_side_key_mykey')
    assert.are.equal(tags['_side_key_mykey'], 'both')
    assert.are.equal(tablex.size(tags), 4)
  end)

  it('returns nothing if the wrong direction values is used', function()
    local tags = { direction = 'up', foo = 'bar', mykey = 4 }
    transform_point_direction_tags(tags, '_side_key_mykey')
    assert.are.equal(tablex.size(tags), 3)
  end)

  it('treats a missing direction tag as "both"', function()
    local tags = { foo = 'bar', mykey = 5 }
    transform_point_direction_tags(tags, '_side_key_mykey')
    assert.are.equal(tags['_side_key_mykey'], 'both')
    assert.are.equal(tablex.size(tags), 3)
  end)
end)
