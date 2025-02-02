-- local inspect = require('inspect')

---@desc Call every todo function of a given todo list with the given tag objects and collect the results
---@param todoFunctions table like `processing/topics/roads_bikelanes/bikelanes/BikelaneTodos.lua` and `RoadTodos.lua`
---@return table `Array<{id: string, prio: string, todoTableOnly: boolean}>`
function CollectTodos(todoFunctions, tagsObject, resultTags)
  local todoResults = {}

  for _, todoFunc in ipairs(todoFunctions) do
    local result = todoFunc(tagsObject, resultTags)
    if (result) then
      table.insert(todoResults, {
        id = result.id,
        priority = "prio" .. result.priority,
        todoTableOnly = result.todoTableOnly,
      })
    end
  end

  return todoResults
end
