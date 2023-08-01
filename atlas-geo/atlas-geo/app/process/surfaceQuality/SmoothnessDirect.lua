function SmoothnessDirect(smoothness)
  local normalized = nil
  local source = "nothing_found"
  local confidence = "nothing_found"

  if smoothness ~= nil then
    source = "tag"
    confidence = "high"

    -- We only support some smoothness values to make things easier for the user
    local smoothnessNormalization = {
      ["excellent"] = "excellent",
      ["very_good"] = "excellent",
      ["good"] = "good",
      ["intermediate"] = "intermediate",
      ["bad"] = "bad",
      ["very_bad"] = "very_bad",
      ["impassable"] = "very_bad",
      ["horrible"] = "very_bad",
      ["very_horrible"] = "very_bad",
    }
    local normalized = smoothnessNormalization[smoothness]

    if normalized == nil then
      source = "nothing_found"
      confidence = "nothing_found"
    elseif normalized ~= smoothness then
      source = "tag_normalized"
    end
    return normalized, source, confidence
  end

  return nil, source, confidence
end
