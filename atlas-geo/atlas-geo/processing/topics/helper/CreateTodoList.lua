require("ToMarkdownList")
function CreateTodoList(todos, tagsObject, resultTags)
  local todoList = {}

  for _, todo in ipairs(todos) do
    local result = todo(tagsObject, resultTags)
    if todo then
      table.insert(todoList, result)
    end
  end
  return ToMarkdownList(todoList)
end
