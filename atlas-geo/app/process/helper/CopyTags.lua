function CopyTags(src, dst, tags)
  for _, val in pairs(tags) do
    dst[val] = src[val]
  end
  return dst
end
