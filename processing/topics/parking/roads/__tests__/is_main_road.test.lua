describe("`is_main_road`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
  require("is_main_road")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = is_main_road(tags)
    assert.are.equal(result, false)
  end)

  it('works for highways', function()
    local tags = {
      ["highway"] = 'residential',
    }
    local result = is_main_road(tags)
    assert.are.equal(result, true)
  end)

  it('ignores service highways', function()
    local tags = {
      ["highway"] = 'service',
    }
    local result = is_main_road(tags)
    assert.are.equal(result, false)
  end)

  it('works for construction highways', function()
    local tags = {
      ["highway"] = 'construction',
      ["construction"] = 'residential',
    }
    local result = is_main_road(tags)
    assert.are.equal(result, true)
  end)

  it('ignores service construction highways', function()
    local tags = {
      ["highway"] = 'construction',
      ["construction"] = 'service',
    }
    local result = is_main_road(tags)
    assert.are.equal(result, false)
  end)
end)
