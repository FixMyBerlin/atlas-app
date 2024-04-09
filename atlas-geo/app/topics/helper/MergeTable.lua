---@param mutateDst table
---@param src table|nil
---@return table
-- Mutate `mutateDst` by copying all key value pairs from `src` to `mutateDst`
function MergeTable(mutateDst, src)
  if (src == nil) then return mutateDst end

  for k, v in pairs(src) do
    mutateDst[k] = v
  end
  return mutateDst
end
