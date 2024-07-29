---@param category table
---@return table, table, table
function CreateSubcategoriesAdjoiningOrIsolated(category)
  local adjoining = BikelaneCategory.new({
    id = category.id .. '_adjoining',
    desc = category.desc .. ' (adjoining)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and IsSidepath(tags) and tags.is_sidepath ~= "no" end
  })
  local isolated = BikelaneCategory.new({
    id = category.id .. '_isolated',
    desc = category.desc .. ' (isolated)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and tags.is_sidepath == "no" end
  })
  local adjoiningOrIsolated = BikelaneCategory.new({
    id = category.id .. '_adjoiningOrIsolated',
    desc = category.desc .. ' (adjoiningOrIsolated)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and not IsSidepath(tags) and tags.is_sidepath ~= "no" end
  })
  return adjoining, isolated, adjoiningOrIsolated
end
