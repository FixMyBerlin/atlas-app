local onewayAssumedNo = Set({
  'bicycleRoad', -- road shared, both lanes
  'livingStreet', -- road shared, both lanes
  'pedestrianAreaBicycleYes', -- road shared, both lanes
  'sharedMotorVehicleLane', -- (both) road shared, both lanes, (left|right would be `implicit_yes`)
  'explicitSharedLaneButNoSignage', -- (both) road shared, both lanes, (left|right would be `implicit_yes`)
  'footAndCyclewayShared_isolated', -- "track"-like
  'footAndCyclewaySegregated_isolated', -- "track"-like
  'cycleway_adjoining', -- "track"-like and `oneway=yes` (common in cities) is usually explicit
  'cycleway_isolated', -- road for bikes `oneway=yes` unexpected or usually explicit
  'cycleway_adjoiningOrIsolated', -- "track"-like
  'crossing', -- really unknown, but `oneway=yes` (which is common in cities) is usually explicit
  'cyclewayLink', -- really unknown, but `oneway=yes` (which is common in cities) is usually explicit
  'needsClarification' -- really unknown, but `oneway=yes` (which is common in cities) is usually explicit
})
local onewayImplicitYes = Set({
  'cyclewayOnHighway_advisory', -- "lane"-like
  'cyclewayOnHighway_exclusive', -- "lane"-like
  'cyclewayOnHighway_advisoryOrExclusive', -- "lane"-like
  'cyclewayOnHighwayBetweenLanes', -- "lane"-like
  'sharedBusLane', -- "shared lane"-like
  'footAndCyclewayShared_adjoining', -- "shared lane"-like
  'footAndCyclewayShared_adjoiningOrIsolated', -- unclear, fall back to "shared lane"-like
  'footAndCyclewaySegregated_adjoining', -- "lane"-like
  'footAndCyclewaySegregated_adjoiningOrIsolated', -- unclear, fall back to "lane"-like
  'footwayBicycleYes_adjoining', -- "shared lane"-like
  'footwayBicycleYes_isolated', -- "shared lane"-like, still assuming "oneway=yes" because too little space or it would be "footAndCyclewayShared_isolated"
  'footwayBicycleYes_adjoiningOrIsolated' -- unclear, fall back to "shared lane"-like
})
---comment
---@param category string
---@return 'assumed_no' | 'implicit_yes' | 'unknown'
--- Infer oneway information based on the given category
function InferOneway(category)
  if onewayAssumedNo[category] then
    return 'assumed_no'
  end
  if onewayImplicitYes[category] then
    return 'implicit_yes'
  end
  return 'unknown'
end
