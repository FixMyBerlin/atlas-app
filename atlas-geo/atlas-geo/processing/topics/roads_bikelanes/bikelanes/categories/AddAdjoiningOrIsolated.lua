package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
require("IsSidepath")

---@param categoryName string
---@param tags table
---@return string
function AddAdjoiningOrIsolated(categoryName, tags)
  local postfix = 'adjoiningOrIsolated'
  if IsSidepath(tags) then
    postfix = "adjoining"
  end
  if tags.is_sidepath == "no" then
    postfix = "isolated"
  end
  return categoryName .. "_" .. postfix
end
