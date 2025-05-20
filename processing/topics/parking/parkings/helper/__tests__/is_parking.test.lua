describe("`is_parking`", function()
  require('init')
  require("is_parking")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = is_parking(tags)
    assert.are.is_false(result)
  end)

  it('is_road is always parking', function()
    local tags = {
      ["highway"] = 'residential',
    }
    local result = is_parking(tags)
    assert.are.is_true(result)
  end)

  it('is_driveway is true when "parking:" given', function()
    local tags = {
      ["highway"] = 'service',
      ["parking:left"] = 'lane',
    }
    local result = is_parking(tags)
    assert.are.is_true(result)
  end)

  it('is_driveway is false with unclear parking value', function()
    local tags = {
      ["highway"] = 'service',
      ["parking:left"] = 'yes',
    }
    local result = is_parking(tags)
    assert.are.is_false(result)
  end)

  it('is_driveway is false without "parking:"', function()
    local tags = {
      ["highway"] = 'service',
    }
    local result = is_parking(tags)
    assert.are.is_false(result)
  end)
end)
