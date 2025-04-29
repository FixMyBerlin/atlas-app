describe("`exit_processing_parkings`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/parkings/helper/?.lua"
  require("exit_processing_parkings")
  require("Log")

  it('ignores non highway', function()
    local tags = {
      ["foo"] = 'bar',
    }
    local result = exit_processing_parkings(tags)
    assert.are.equal(result, true)
  end)

  it('works when any tag is prefixed with "parking:"', function()
    local tags = {
      ["highway"] = 'service',
      ["parking:foo"] = 'bar',
    }
    local result = exit_processing_parkings(tags)
    assert.are.equal(result, false)
  end)
end)
