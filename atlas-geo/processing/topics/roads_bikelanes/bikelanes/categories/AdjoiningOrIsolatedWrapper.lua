---@param category table
---@return table, table, table
function AdjoiningOrIsolatedWrapper(category)
  local adjoining = BikelaneCategory.new({
    name = category.name .. '_adjoining',
    desc = category.desc .. ' (adjoining)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and IsSidepath(tags) and tags.is_sidepath ~= "no" end
  })
  local isolated = BikelaneCategory.new({
    name = category.name .. '_isolated',
    desc = category.desc .. ' (isolated)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and tags.is_sidepath == "no" end
  })
  local adjoiningOrIsolated = BikelaneCategory.new({
    name = category.name .. '_adjoiningOrIsolated',
    desc = category.desc .. ' (adjoiningOrIsolated)',
    infrastructureExists = category.infrastructureExists,
    condition = function(tags) return category(tags) and not IsSidepath(tags) and tags.is_sidepath ~= "no" end
  })
  return adjoining, isolated, adjoiningOrIsolated
end
