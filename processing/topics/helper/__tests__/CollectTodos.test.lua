describe("CollectTodos", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
  require("CollectTodos")
  require("RoadTodos")
  -- local inspect = require("inspect")

  it('Return id, priority, todoTableOnly', function()
    local tagsObject = { cycleway = "shared" }
    local result = CollectTodos(RoadTodos, tagsObject, {})
    local expected = {
      [1] = {
        ["id"] = "deprecated_cycleway_shared",
        ["priority"] = "prio1",
        ["todoTableOnly"] = false,
      },
    }
    assert.are.same(result, expected)
  end)

  it('Handle no match', function()
    local result = CollectTodos(RoadTodos, {}, {})
    assert.are.same(result, {})
  end)
end)
