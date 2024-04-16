---@param original_tags table
---@param result_tags table
---@return integer
--- Return the minzoom and maxzoom for paths
function PathsGeneralisation(original_tags, result_tags)
  if original_tags.highway == 'path' and result_tags.length < 1000 then
    return 13
  end
  return 0
end
