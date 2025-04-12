
function categorize_obstacles(tags, categories)
  for _, category in ipairs(categories) do
    if category(tags) then
      return category
    end
  end
  return nil
end
