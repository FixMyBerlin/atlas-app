function CopyTags(dst, src, tags, prefix)
  prefix = prefix or ''
  for _, val in pairs(tags) do
    dst[prefix .. val] = src[val]
  end
  return dst
end
