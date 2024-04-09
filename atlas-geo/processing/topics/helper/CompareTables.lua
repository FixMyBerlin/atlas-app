-- @desc Determines whether the contents of two tables match or not by concatenating their elements into strings and comparing them.
-- Thanks at https://stackoverflow.com/a/20326368/729221
function CompareTableValues(a, b)
  return table.concat(a) == table.concat(b)
end

-- @desc Compare tables key+value by string concatenation.
function CompareTables(tableOne, tableTwo)
  if not tableOne or not tableTwo then
    return false
  end

  local tableOneString = ""
  local tableTwoString = ""

  local tableAKeysSorted = {}
  for k in pairs(tableOne) do table.insert(tableAKeysSorted, k) end
  table.sort(tableAKeysSorted)

  local tableBKeysSorted = {}
  for k in pairs(tableTwo) do table.insert(tableBKeysSorted, k) end
  table.sort(tableBKeysSorted)

  for _, k in ipairs(tableAKeysSorted) do
    tableOneString = tableOneString .. tostring(k) .. tostring(tableOne[k])
  end

  for _, k in ipairs(tableBKeysSorted) do
    tableTwoString = tableTwoString .. tostring(k) .. tostring(tableTwo[k])
  end

  return tableOneString == tableTwoString
end
