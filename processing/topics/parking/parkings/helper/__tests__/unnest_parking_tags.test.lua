describe('`unnest_parking_tags`', function()
  package.path = package.path .. ';/processing/topics/helper/?.lua'
  package.path = package.path .. ';/processing/topics/parking/parkings/helper/?.lua'
  require('unnest_parking_tags')
  require('Log')
  require('osm2pgsql')
  local inspect = require('inspect')

  it('does nothing when not postfix given', function()
    local rawTags = {
      ['foo'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, ':both', result)
    assert.are.equal(inspect(result), '{}')
  end)

  it('does nothing when wrong postfix given', function()
    local rawTags = {
      ['foo'] = 'bar',
      ['parking:both:orientation'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, ':foobar', result)
    assert.are.equal(inspect(result), '{}')
  end)

  it('resolves postfix :both', function()
    local rawTags = {
      ['foo'] = 'bar',
      ['parking:both'] = 'lane',
      ['parking:both:orientation'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, ':both', result)
    assert.are.equal(inspect(result), '{\n  orientation = "bar",\n  parking = "lane"\n}')
  end)

  it('resolves postfix :left', function()
    local rawTags = {
      ['foo'] = 'bar',
      ['parking:left:orientation'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, ':left', result)
    assert.are.equal(inspect(result), '{\n  orientation = "bar"\n}')
  end)

  it('resolves postfix :right', function()
    local rawTags = {
      ['foo'] = 'bar',
      ['parking:right:orientation'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, ':right', result)
    assert.are.equal(inspect(result), '{\n  orientation = "bar"\n}')
  end)

  it('resolves postfix :nil', function()
  local rawTags = {
      ['foo'] = 'bar',
      ['parking:orientation'] = 'bar',
      ['parking:fee'] = 'bar',
    }
    local result = {}
    unnest_parking_tags(rawTags, '', result)
    assert.are.equal(inspect(result), '{\n  fee = "bar",\n  orientation = "bar"\n}')
  end)

  it('handles all three cases', function()
    local rawTags = {
      ['foo'] = 'bar',
      ['parking:orientation'] = 'foo1',
      ['parking:both:orientation'] = 'foo2',
      ['parking:left:orientation'] = 'foo3',
    }
    local result = {}
    unnest_parking_tags(rawTags, '', result)
    unnest_parking_tags(rawTags, ':both', result)
    unnest_parking_tags(rawTags, ':left', result)
    assert.are.equal(inspect(result), '{\n  orientation = "foo3"\n}')
  end)

end)
