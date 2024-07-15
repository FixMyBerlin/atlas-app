describe("TimeUtils", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("TimeUtils")

  describe("AgeInDays", function()
    it('return nil for nil input', function()
      local result = AgeInDays(nil)
      assert.are.same(result, nil)
    end)

    it('return correct age in days for valid date', function()
      local today = os.time()
      local yesterday = today - 3600 * 24 * 1
      local result = AgeInDays(yesterday)
      assert.are.same(result, 1)
    end)

    it('return nil for invalid date', function()
      local result = AgeInDays("foo")
      assert.are.same(result, nil)
    end)
  end)

  describe("ParseDate", function()
    it('should return correct timestamp for valid date', function()
      local result = ParseCheckDate("2023-12-01")
      assert(result == os.time({ year = 2023, month = 12, day = 1 }))
    end)

    it('should return nil for nil input', function()
      local result = ParseCheckDate(nil)
      assert(result == nil)
    end)

    it('should return nil for invalid date format', function()
      local result = ParseCheckDate("23-12-01")
      assert(result == nil)
    end)

    it('should return nil for invalid date format', function()
      local result = ParseCheckDate("12-01-2023")
      assert(result == nil)
    end)

    it('should return correct timestamp for valid date with day set to 0', function()
      local result = ParseCheckDate("2023-12-00")
      assert(result == os.time({ year = 2023, month = 12, day = 0 }))
    end)

    it('should return nil for invalid date format', function()
      local result = ParseCheckDate("2023-12")
      assert(result == nil)
    end)

    it('should return nil for invalid date format', function()
      local result = ParseCheckDate("2023")
      assert(result == nil)
    end)

    it('should return nil for invalid date format', function()
      local result = ParseCheckDate("foo")
      assert(result == nil)
    end)
  end)
end)
