-- @desc Transform a list of string into a Markdown list
-- @param array string[]
-- @return string|nil
function ToMarkdownList(array)
  if not array or #array == 0 then
    return nil
  end

  local result = ""
  for _, v in ipairs(array) do
    result = result .. "* " .. v .. "\n"
  end
  return result
end
