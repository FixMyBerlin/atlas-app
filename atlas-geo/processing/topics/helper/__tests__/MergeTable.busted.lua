describe("MergeTable", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  require("MergeTable")

  describe('=== Test MergeTable ===', function()
    local base = { ["base"] = "base" }

    it('should merge two tables', function()
      local merge = { ["merge"] = "merge" }
      local result = MergeTable(base, merge)
      assert.are.same(result, { ["base"] = "base", ["merge"] = "merge" })
    end)

    it('should return the base table when the merge table is empty', function()
      local merge = {}
      local result = MergeTable(base, merge)
      assert.are.same(result, base)
    end)

    it('should return the base table when the merge table is nil', function()
      local merge = nil
      local result = MergeTable(base, merge)
      assert.are.same(result, base)
    end)
  end)
end)
