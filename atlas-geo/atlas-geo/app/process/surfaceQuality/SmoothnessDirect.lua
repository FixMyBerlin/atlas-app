function SmoothnessDirect(smoothness)
  local value = smoothness
  local source = "nothing_found"
  local confidence = "nothing_found"

  if value ~= nil then
    source = "tag"
    confidence = "high"

    -- We only support some smoothness values to make thinks easier for the user
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
    value = smoothnessNormalization[value]

    if value == nil then
      value = nil
      source = "tag_normalized"
      confidence = "nothing_found"
    end

    if value and value ~= smoothness then
      source = "tag_normalized"
    end
  end

  return value, source, confidence
end
