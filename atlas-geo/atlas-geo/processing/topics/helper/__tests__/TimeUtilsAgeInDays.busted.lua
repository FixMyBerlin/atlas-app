describe("TimeUtils", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("TimeUtils")

  it('should return nil for nil input', function()
    local result = AgeInDays(nil)
    assert.are.same(result, nil)
  end)

  it('should return correct age in days for valid date', function()
    local today = os.time()
    local yesterday = today - 3600 * 24 * 1
    local result = AgeInDays(yesterday)
    assert.are.same(result, 1)
  end)

  it('should return nil for invalid date', function()
    local result = AgeInDays("foo")
    assert.are.same(result, nil)
  end)
end)
