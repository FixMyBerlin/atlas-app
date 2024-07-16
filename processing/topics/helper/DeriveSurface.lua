local function surfaceDirect(surface)
  if surface ~= nil then
    local source = "tag"
    local confidence = "high"

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
    return surface, source, confidence
  end

  return nil, nil, nil
end

function DeriveSurface(tags)
  local surface, source, confidence = surfaceDirect(tags.surface)
  return { surface = surface, surface_source = source, surface_confidence = confidence }
end
