---@param array `Array<{id: string, prio: string, todoTableOnly: boolean}>`
---@return table A table where each entry is a table with the structure `{ID: PRIORITY}`
-- Transform a list of string into a Markdown list
function ToTodoTags(array)
  if not array or next(array) == nil then
    return {}
  end

  local result = {}
  for _, obj in ipairs(array) do
    result[obj.id] = obj.priority
  end
  return result
end
