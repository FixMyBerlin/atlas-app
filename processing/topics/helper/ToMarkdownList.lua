---@param array `Array<{id: string, prio: string, todoTableOnly: boolean}>`
---@return string|nil
-- Transform a list of string into a Markdown list
function ToMarkdownList(array)
  if not array or next(array) == nil then
    return nil
  end

  local result = ""
  for _, obj in ipairs(array) do
    if obj.todoTableOnly ~= true then
      result = result .. "* " .. obj.id .. "\n"
    end
  end
  return result
end
