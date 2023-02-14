-- Playground http://tpcg.io/_5LRFVV

function FilterTags(tags, allowedTags)
  for key, _ in pairs(tags) do
    if not allowedTags[key] then
      tags[key] = nil
    end
  end
end

-- this function is faster iff |tags| > |allowedTags|
-- function FilterTags2(tags, allowedTags)
--   local tagsFiltered = {}
--   for key, _ in pairs(allowedTags) do
--     if tags[key] ~= nil then
--       tagsFiltered[key] = tags[key]
--     end
--   end
--   return tagsFiltered
-- end

