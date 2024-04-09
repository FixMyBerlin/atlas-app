--- remove and return all tags starting with `_`
---@param tags table
---@return table
function DropInternalTags(tags)
  local removedTags = {}
  for k, v in pairs(tags) do -- remove internal tags starting with '_'
    if k:match("^_") then
      tags[k] = nil
      removedTags[k] = v
    end
  end
  return removedTags
end
