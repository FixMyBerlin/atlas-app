---@param array table[]
---@return string|nil
-- Transform a list of string into a Markdown list
function ToMarkdownList(array)
  if not array or next(array) == nil then
    return nil
  end

  local result = ""
  for k, _ in pairs(array) do
    result = result .. "* " .. k .. "\n"
  end
  return result
end
