---@param str string?
---@param subStr string?
---@return boolean
function ContainsSubstring(str, subStr)
  if (str == nil) then return false end
  if (subStr == nil) then return false end
  if string.find(str, subStr, 1, true) ~= nil then
    return true
  end
  return false
end
