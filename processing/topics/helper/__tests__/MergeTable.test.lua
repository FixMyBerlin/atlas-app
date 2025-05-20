describe("MergeTable", function()
  require('init')
  require("MergeTable")

  local base = { ["base"] = "base" }

  it('merge two tables', function()
    local merge = { ["merge"] = "merge" }
    local result = MergeTable(base, merge)
    assert.are.same(result, { ["base"] = "base", ["merge"] = "merge" })
  end)

  it('return the base table when the merge table is empty', function()
    local merge = {}
    local result = MergeTable(base, merge)
    assert.are.same(result, base)
  end)

  it('return the base table when the merge table is nil', function()
    local merge = nil
    local result = MergeTable(base, merge)
    assert.are.same(result, base)
  end)
end)
