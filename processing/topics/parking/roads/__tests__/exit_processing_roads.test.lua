describe("`exit_processing_roads`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
  require("exit_processing_roads")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, true)
  end)

  it('works for highways', function()
    local tags = {
      ["highway"] = 'residential',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, false)
  end)

  it('ignores service highways', function()
    local tags = {
      ["highway"] = 'service',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, true)
  end)

  it('works for construction highways', function()
    local tags = {
      ["highway"] = 'construction',
      ["construction"] = 'residential',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, false)
  end)

  it('ignores service construction highways', function()
    local tags = {
      ["highway"] = 'construction',
      ["construction"] = 'service',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, true)
  end)

  it('works for access', function()
    local tags = {
      ["highway"] = 'residential',
      ["vehicle"] = 'destination',
    }
    local result = exit_processing_roads(tags)
    assert.are.equal(result, false)
  end)
end)
