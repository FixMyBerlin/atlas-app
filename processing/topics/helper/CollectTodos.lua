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
