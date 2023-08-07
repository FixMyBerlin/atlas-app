function MergeTable(a, b)
  for k, v in pairs(b) do
    a[k] = v
  end
end
