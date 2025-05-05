---@param dst table
---@param src table|nil
---@param tags table
---@param prefix? string
---@return table
-- Copy the given `tags` from table `src` to table `dst`
function CopyTags(dst, src, tags, prefix)
  prefix = prefix or ''

  if src == nil or next(src) == nil then
    return dst
  end

  for _, val in pairs(tags) do
    if(src[val] ~= nil) then
      dst[prefix .. val] = src[val]
    end
  end
  return dst
end
