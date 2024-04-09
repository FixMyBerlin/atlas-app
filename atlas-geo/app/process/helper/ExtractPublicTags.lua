--- extract all key, value pairs that are not starting with `_`
---@param tags table
---@return table
function ExtractPublicTags(tags)
  local publicTags = {}
  for k, v in pairs(tags) do -- remove internal tags starting with '_'
    if not k:match("^_") then
      publicTags[k] = v
    end
  end
  return publicTags
end
