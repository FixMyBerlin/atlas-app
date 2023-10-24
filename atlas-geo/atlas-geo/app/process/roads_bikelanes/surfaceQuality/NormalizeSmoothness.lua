require("Set")
function NormalizeSmoothness(smoothness)
  if smoothness ~= nil then
    local smoothnessDirect = Set({
      "excellent",
      "good",
      "intermediate",
      "bad",
      "very_bad"
    })
    -- We only support some smoothness values to make things easier for the user
    local smoothnessNormalization = {
      ["very_good"] = "excellent",
      ["impassable"] = "very_bad",
      ["horrible"] = "very_bad",
      ["very_horrible"] = "very_bad",
    }
    if smoothnessDirect[smoothness] then
      return smoothness, "tag", "high"
    else
      local normalized = smoothnessNormalization[smoothness]
      if normalized then
        return normalized, "tag_normalized", "high"
      end
    end
  end
  return nil, nil, nil
end
