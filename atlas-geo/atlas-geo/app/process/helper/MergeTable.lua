-- Copy all key value pairs from src to dst
function MergeTable(dst, src)
  for k, v in pairs(src) do
    dst[k] = v
  end
  return dst
end
