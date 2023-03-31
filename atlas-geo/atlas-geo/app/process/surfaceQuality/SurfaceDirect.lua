function SurfaceDirect(surface)
  local value = surface
  local source = "nothing_found"
  local confidence = "nothing_found"

  if value ~= nil then
    source = "tag"
    confidence = "high"

    -- TODO: Later, we should add this…
    -- We only support some smoothness values to make thinks easier for the user
    -- local surfaceNormalization = {
    --   ["excellent"] = "excellent",
    --   ["very_good"] = "excellent",
    --   ["good"] = "good",
    --   ["intermediate"] = "intermediate",
    --   ["bad"] = "bad",
    --   ["very_bad"] = "very_bad",
    --   ["impassable"] = "very_bad",
    --   ["horrible"] = "very_bad",
    --   ["very_horrible"] = "very_bad",
    -- }
    -- value = surfaceNormalization[value]

    -- if value == nil then
    --   value = nil
    --   source = "tag_normalized"
    --   confidence = "nothing_found"
    -- end

    -- if value and value ~= surface then
    --   source = "tag_normalized"
    -- end
  end

  return value, source, confidence
end
