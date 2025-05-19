function to_date(tagsObject, toNumberTags)
  for key, value in pairs(tagsObject) do
    if toNumberTags[key] then
      tagsObject[key] = os.date('!%Y-%m-%dT%H:%M:%SZ', value)
    end
  end
end
