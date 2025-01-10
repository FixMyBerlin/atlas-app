describe("CollectTodos", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
  require("CollectTodos")
  require("RoadTodos")

  it('Return id and priority', function()
    local tagsObject = { cycleway = "shared" }
    local result = CollectTodos(RoadTodos, tagsObject, {})
    assert.are.same(result, { deprecated_cycleway_shared = "1" })
  end)

  it('Handle no match', function()
    local result = CollectTodos(RoadTodos, {}, {})
    assert.are.same(result, {})
  end)
end)
