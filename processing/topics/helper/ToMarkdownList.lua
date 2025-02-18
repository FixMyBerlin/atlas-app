---@param array `Array<{id: string, prio: string, todoTableOnly: boolean}>`
---@return string|nil
-- Transform a list of string into a Markdown list
function ToMarkdownList(array)
  if not array then
    return nil
  end

  local filteredArray = {}
  for _, obj in ipairs(array) do
    if obj.todoTableOnly ~= true then
      table.insert(filteredArray, obj)
    end
  end

  if next(filteredArray) == nil then
    return nil
  end

  local result = ""
  for _, obj in ipairs(filteredArray) do
    result = result .. "* " .. obj.id .. "\n"
  end
  return result
end
