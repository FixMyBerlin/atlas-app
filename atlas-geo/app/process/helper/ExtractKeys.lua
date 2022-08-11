function ExtractKeys(list)
  local set = {}
  for key, _ in pairs(list) do table.insert(set, key) end
  return set
end
