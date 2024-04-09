---@param tags table
---@return boolean
function IsSidepath(tags)
  -- `_parent_highway` indicates that this way was split of the centerline; in this case, we consider it a sidepath.
  return tags.is_sidepath == "yes"
      or tags._parent_highway
      or tags.footway == "sidewalk"
      or tags.path == "sidewalk"
      or tags.steps == "sidewalk"
end
