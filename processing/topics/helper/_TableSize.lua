-- https://stackoverflow.com/a/64882015/729221

function TableSize(table)
  local count = 0
  for n in pairs(table) do
    count = count + 1
  end
  return count
end
