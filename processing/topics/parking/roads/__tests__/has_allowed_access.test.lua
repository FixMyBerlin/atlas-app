describe("`has_allowed_access`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
  require("has_allowed_access")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = has_allowed_access(tags)
    assert.are.equal(result, false)
  end)

  it('works for highways', function()
    local tags = {
      ["highway"] = 'residential',
    }
    local result = has_allowed_access(tags)
    assert.are.equal(result, true)
  end)

  it('works for access', function()
    local tags = {
      ["highway"] = 'residential',
      ["vehicle"] = 'destination',
    }
    local result = has_allowed_access(tags)
    assert.are.equal(result, true)
  end)
end)
