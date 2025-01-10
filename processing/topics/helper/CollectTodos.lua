---@desc Call every todo function of a given todo list with the given tag objects and collect the results
---@param todos table like `processing/topics/roads_bikelanes/bikelanes/BikelaneTodos.lua` and `RoadTodos.lua`
function CollectTodos(todos, tagsObject, resultTags)
  local todoList = {}

  for _, todo in ipairs(todos) do
    local result = todo(tagsObject, resultTags)
    if todo then
      table.insert(todoList, result)
    end
  end
  return todoList
end

---@desc: Create a special table with a string as value so the data play nice when being exported.
---       We passed the Set directly to the db insert which means the DB has boolean `true` as a value which caused weird errors when exporting the data.
---@param todos table
---@return table
function TodoPrioMap(todos)
  local prioMap = {}

  for _, todo in ipairs(todos) do
    -- NOTE: In the future, we might extend the todo helper to also return a prio which we then return here
    prioMap[todo] = "1"
  end
  return prioMap
end
