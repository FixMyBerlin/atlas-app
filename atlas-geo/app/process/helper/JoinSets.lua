function JoinSets(a, b, dest)
  dest = dest or {}
  for k, _ in pairs(a) do dest[k] = true end
  for k, _ in pairs(b) do dest[k] = true end
  return dest
end
