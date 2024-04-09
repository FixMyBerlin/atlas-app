function JoinSets(sets, dest)
  dest = dest or {}
  for _, set in pairs(sets) do
    for k, _ in pairs(set) do dest[k] = true end
  end
  return dest
end
