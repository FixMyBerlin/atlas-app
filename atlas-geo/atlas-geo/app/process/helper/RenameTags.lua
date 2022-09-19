-- * @desc `RenameTags(object.tags, { ["update"] = "updated_at" })`
function RenameTags(tagsObject, renameTags)
  for oldName, value in pairs(tagsObject) do
    if renameTags[oldName] then
      local newName = renameTags[oldName]
      tagsObject[newName] = value
      tagsObject[oldName] = nil
    end
  end
end
