describe("AddAdjoiningOrIsolated", function()
  package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
  require("AddAdjoiningOrIsolated")

  it('should add postfix "adjoining" when IsSidepath is true', function()
    local tags = { ["is_sidepath"] = "yes" }
    local result = AddAdjoiningOrIsolated("foo", tags)
    assert.are.same(result, "foo_adjoining")
  end)

  it('should add postfix isolated when is_sidepath is no', function()
    local tags = { ["is_sidepath"] = "no" }
    local result = AddAdjoiningOrIsolated("foo", tags)
    assert.are.same(result, "foo_isolated")
  end)

  it('should add postfix adjoiningOrIsolated when is_sidepath is not defined', function()
    local tags = {}
    local result = AddAdjoiningOrIsolated("foo", tags)
    assert.are.same(result, "foo_adjoiningOrIsolated")
  end)
end)
