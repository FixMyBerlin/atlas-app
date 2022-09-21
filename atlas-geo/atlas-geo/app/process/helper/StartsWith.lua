function StartsWith(str, start)
  if str == nil then return false end
  if start == nil then return false end

  return str:sub(1, #start) == start
end
