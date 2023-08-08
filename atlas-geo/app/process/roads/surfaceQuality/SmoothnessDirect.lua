function SmoothnessDirect(smoothness)
  if smoothness ~= nil then
    local source = "tag"
    local confidence = "high"

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

    if normalized ~= smoothness then
      source = "tag_normalized"
    end
    return normalized, source, confidence
  end

  return nil, nil, nil
end
