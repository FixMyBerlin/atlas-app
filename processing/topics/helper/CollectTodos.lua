---@desc Call every todo function of a given todo list with the given tag objects and collect the results
---@param todoFunctions table like `processing/topics/roads_bikelanes/bikelanes/BikelaneTodos.lua` and `RoadTodos.lua`
function CollectTodos(todoFunctions, tagsObject, resultTags)
  local todoResults = {}

  for _, todoFunc in ipairs(todoFunctions) do
    local result = todoFunc(tagsObject, resultTags)
    if(result) then
      todoResults[result.id] = "prio"..result.priority
    end
  end
  return todoResults
end
