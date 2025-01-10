describe("ToMarkdownList", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
  require("ToMarkdownList")
  require("CollectTodos")
  require("RoadTodos")

  it('Return id string', function()
    local tagsObject = { cycleway = "shared" }
    local todos = CollectTodos(RoadTodos, tagsObject, {})
    local result = ToMarkdownList(todos)

    assert.are.same(result, "* deprecated_cycleway_shared\n")
  end)

  it('Handle empty list', function()
    local todos = CollectTodos(RoadTodos, {}, {})
    local result = ToMarkdownList(todos)
    assert.are.same(result, nil)
  end)
end)
