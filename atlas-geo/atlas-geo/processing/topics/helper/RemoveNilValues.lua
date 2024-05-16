--- Remove table entries where the value is `nil`
---@param inputTable table
---@return table
function RemoveNilValues(inputTable)
  local cleanTable = {}
  for _, v in ipairs(inputTable) do
    if v ~= nil then
      cleanTable[#cleanTable + 1] = v
    end
  end
  return cleanTable
end
