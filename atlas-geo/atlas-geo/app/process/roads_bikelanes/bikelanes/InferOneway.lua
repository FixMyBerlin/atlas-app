local onewayAssumedNo = Set({ 'bicycleRoad', 'pedestrianAreaBicycleYes' })
local onewayImplicitYes = Set({ 'cyclewayOnHighway_exclusive', 'cyclewayOnHighway_advisory',
  'cyclewayOnHighway_advisoryOrExclusive', 'sharedMotorVehicleLane' , 'cyclewayOnHighwayBetweenLanes', 'sharedBusLane'})

function InferOneway(category)
  if onewayAssumedNo[cycleway.category] then
    return 'assumed_no'
  end
  if onewayImplicitYes[category] then
    return 'implicit_yes'
  end
end
