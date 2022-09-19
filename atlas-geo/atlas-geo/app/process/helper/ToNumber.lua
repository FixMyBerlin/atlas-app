-- * @desc `ToNumber(object.tags, Set({ 'width' }))`
function ToNumber(tagsObject, toNumberTags)
  for key, value in pairs(tagsObject) do
    if toNumberTags[key] then
      tagsObject[key] = tonumber(value)
    end
  end
end
