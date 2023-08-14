function SmoothnessFromSurface(surface)
  local surfaceToSmoothness = {
    ["cobblestone:flattened"] = "bad",
    ["concrete:lanes"] = "intermediate",
    ["concrete:plates"] = "intermediate",
    ["stone:plates"] = "intermediate",
    ["asphalt"] = "good",
    ["brick"] = "bad",
    ["cobblestone"] = "very_bad",
    ["compacted"] = "intermediate",
    ["concrete"] = "intermediate",
    ["dirt"] = "bad",
    ["earth"] = "bad",
    ["fine_gravel"] = "intermediate",
    ["granite"] = "intermediate",
    ["grass_paver"] = "bad",
    ["grass"] = "bad",
    ["gravel"] = "bad",
    ["gravel:lanes"] = "bad",
    ["ground"] = "bad",
    ["metal_grid"] = "bad",
    ["metal"] = "good",
    ["mud"] = "very_bad",
    ["paved"] = "intermediate",
    ["paving_stones"] = "intermediate",
    ["pebblestone"] = "very_bad",
    ["rock"] = "very_bad",
    ["rubber"] = "good",
    ["sand"] = "very_bad",
    ["sett"] = "bad",
    ["stepping_stones"] = "bad", -- https://www.openstreetmap.org/way/669442481 Stones on grass
    ["stone"] = "bad",
    ["tartan"] = "good",         -- rubber https://www.google.com/search?q=tartan+paving
    ["unhewn_cobblestone"] = "very_bad",
    ["unpaved"] = "bad",
    ["wood"] = "intermediate",
    ["woodchips"] = "very_bad",
  }

  local surfaceToSmoothnessNonStandardValues = {
    [":plates"] = "intermediate",
    ["asphalt;compacted"] = "intermediate",
    ["asphalt;paving_stones"] = "intermediate",
    ["sandstone"] = "intermediate",
    ["asphalt:lanes"] = "intermediate",
    ["asphalt|sett"] = "very_bad",
    ["cobblestone;ground"] = "bad",
    ["cobblestone;asphalt"] = "bad",
    ["compacted;paving_s"] = "bad",
    ["compacted;paving_stones"] = "intermediate",
    ["dirt;grass"] = "bad",
    ["dirt/sand"] = "very_bad",
    ["dirt;sand"] = "very_bad",
    ["3"] = "bad",
    ["grass;gravel"] = "bad",
    ["ground;grass"] = "bad",
    ["grass;ground"] = "bad",
    ["gravel:tracks"] = "bad",
    ["gravel;grass"] = "bad",
    ["fine_gravel;grass"] = "bad",
    ["fine_gravel;ground"] = "bad",
    ["gravel;ground"] = "bad",
    ["gravel; grass"] = "bad",
    ["clay"] = "bad",
    ["paving_s;sett"] = "bad",
    ["paving_stones;asphalt"] = "intermediate",
    ["paving_stones;sett"] = "bad",
    ["paving_stones:30"] = "intermediate",
    ["sett;paving_s"] = "bad",
    ["sett;paving_stones;cobblestone:flattened"] = "bad",
    ["sett;paving_stones"] = "bad",
    ["grass_unpaved"] = "bad",
    ["grund"] = "bad",
    ["macadam"] = "intermediate", -- https://www.google.com/search?q=macadam
    ["paving_stonees"] = "intermediate",
    ["tiles"] = "bad",
  }

  if not surface then
    return nil, nil, nil, "Please add surface=*"
  end
  local smoothness = surfaceToSmoothness[surface]
  local source, confidence, todo = nil, nil, nil
  if smoothness ~= nil then
    source = 'surface_to_smoothness'
    confidence = 'medium'
  else
    smoothness = surfaceToSmoothnessNonStandardValues[surface]
    if smoothness then
      source = 'surface_to_smoothness'
      confidence = 'medium'
      todo = "Please review surface=" ..
        surface .. " which is a non standard value (List surfaceToSmoothnessNonStandardValues)"
    else
      todo = "Please review surface=" ..
      surface ..
      " which is a non standard value. Maybe fix it or add it to our list surfaceToSmoothnessNonStandardValues."
    end
  end
  return smoothness, source, confidence, todo
end
