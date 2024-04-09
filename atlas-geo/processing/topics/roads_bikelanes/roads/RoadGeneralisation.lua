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

---@param object_tags table
---@param result_tags table
---@return { minzoom: boolean|nil, maxzooom: boolean|nil}
--- Return the minzoom and maxzoom for roads
function RoadGeneralisation(object_tags, result_tags)
  local minzoom = nil
  local maxzoom = nil

  if minzoom11RoadClasses[result_tags.road] then
    minzoom = 11
  end

  return { _minzoom = minzoom, _maxzoom = maxzoom }
end
