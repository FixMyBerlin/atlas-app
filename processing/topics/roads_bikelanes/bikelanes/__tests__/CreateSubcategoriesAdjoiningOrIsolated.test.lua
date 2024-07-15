describe("CreateSubcategoriesAdjoiningOrIsolated", function()
  package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
  require("BikelaneCategories")
  require("CreateSubcategoriesAdjoiningOrIsolated")

  local testCategory = BikelaneCategory.new({id = "test", desc = '', condition= function () return true end })
  local testCategoryAdjoining, testCategoryIsolated, testCategoryAdjoiningOrIsolated = CreateSubcategoriesAdjoiningOrIsolated(testCategory)
  it('should add postfix "adjoining" when IsSidepath is true', function()
    local tags = { ["is_sidepath"] = "yes" }
    assert.is_true(testCategoryAdjoining(tags))
    assert.is_false(testCategoryIsolated(tags))
    assert.is_false(testCategoryAdjoiningOrIsolated(tags))
  end)

  it('should add postfix isolated when is_sidepath is no', function()
    local tags = { ["is_sidepath"] = "no" }
    assert.is_false(testCategoryAdjoining(tags))
    assert.is_true(testCategoryIsolated(tags))
    assert.is_false(testCategoryAdjoiningOrIsolated(tags))
  end)

  it('should add postfix adjoiningOrIsolated when is_sidepath is not defined', function()
    local tags = {}
    assert.is_false(testCategoryAdjoining(tags))
    assert.is_false(testCategoryIsolated(tags))
    assert.is_true(testCategoryAdjoiningOrIsolated(tags))
  end)
end)
