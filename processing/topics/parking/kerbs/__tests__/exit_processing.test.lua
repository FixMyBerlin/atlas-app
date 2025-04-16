describe("`exit_processing`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/kerbs/helper/?.lua"
  require("exit_processing")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = exit_processing(tags)
    assert.are.equal(result, true)
  end)

  it('works for highways', function()
    local tags = {
      ["highway"] = 'service',
    }
    local result = exit_processing(tags)
    assert.are.equal(result, false)
  end)

  it('works for construction highways', function()
    local tags = {
      ["highway"] = 'construction',
      ["construction"] = 'service',
    }
    local result = exit_processing(tags)
    assert.are.equal(result, false)
  end)
end)
