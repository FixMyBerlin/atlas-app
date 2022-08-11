-- Playground http://tpcg.io/_5LRFVV

function FilterTags(tagsObject, allowedTags)
  for key, _ in pairs(tagsObject) do
    if not allowedTags[key] then
      tagsObject[key] = nil
    end
  end
end
