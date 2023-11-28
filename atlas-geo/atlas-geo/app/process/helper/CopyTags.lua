function CopyTags(dst, src, tags, prefix)
  for _, val in pairs(tags) do
    dst[prefix .. val] = src[val]
  end
  return dst
end
