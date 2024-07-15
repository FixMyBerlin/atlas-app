-- Hide those roads with road=*
local minzoom11RoadClasses = Set({
  'residential',
  'living_street',
  'bicycle_road',
  'pedestrian',
  'unclassified',
  'residential_priority_road',
  'unspecified_road',
  'service_road',
  'service_alley',
})

---@param original_tags table
---@param result_tags table
---@return integer
--- Return the minzoom and maxzoom for roads
function RoadGeneralization(original_tags, result_tags)
  if minzoom11RoadClasses[result_tags.road] then
    return 11
  end
  return 0
end
