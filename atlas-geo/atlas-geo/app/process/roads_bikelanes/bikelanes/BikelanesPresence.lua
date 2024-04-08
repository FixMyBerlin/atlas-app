package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/?.lua"
require("transformations")
require("HighwayClasses")

function BikelanesPresence(object, cycleways)
  local tags = object.tags
  local presence = {}
  local sides = { LEFT_SIGN, CENTER_SIGN, RIGHT_SIGN }
  for _, cycleway in ipairs(cycleways) do
    local sign = cycleway.sign
    presence[sign] = presence[sign] or cycleway.category
  end

  -- Guard
  if PathClasses[tags.highway] or tags.highway == 'pedestrian' then
    return nil
  end
  if HighwayClasses[tags.highway] then
    return nil
  end

  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed (maybe wait for maxspeed PR)

  -- Set sides to "not_expeced" based on road class OR when infra is present on the center
  local noInfrastructureOnSidesExpected = Set({
    "residential",
    "road",
    "living_street",
    'service',
    'pedestrian', -- unreachable due to PathClasses guard
  })
  if noInfrastructureOnSidesExpected[tags.highway] or presence[CENTER_SIGN] then
    for _, side in pairs(sides) do presence[side] = presence[side] or 'not_expected' end
  end

  -- Set center to "not_expected" when infra is present left OR right
  if presence[RIGHT_SIGN] or presence[LEFT_SIGN] then
    presence[CENTER_SIGN] = presence[CENTER_SIGN] or 'not_expected'
  end

  local noInfrastructureOnSelfAssumed = Set({
    'unclassified',
    'primary', 'primary_link',
    'tertiary', 'tertiary_link',
    'secondary', 'secondary_link',
  })
  if noInfrastructureOnSelfAssumed[tags.highway] then
    -- Set center to "not_expected" based on road class
    presence[CENTER_SIGN] = presence[CENTER_SIGN] or 'not_expected'

    -- Set left/right to "assumed_no" based on road class AND when infra for the other side is present
    --    Usecase: Outside of cities, MajorRoadClasses often have one separate cycleway. Once that is mapped,
    --    we assume the otherside has no separate infra.
    if (
          (presence[LEFT_SIGN] and presence[LEFT_SIGN] ~= 'data_no') or
          (presence[RIGHT_SIGN] and presence[RIGHT_SIGN] ~= 'data_no')
        ) then
      presence[LEFT_SIGN] = presence[LEFT_SIGN] or 'assumed_no'
      presence[RIGHT_SIGN] = presence[RIGHT_SIGN] or 'assumed_no'
    end
  end

  -- Set left to "not_expected" if street is oneway for car and bike
  if tags.oneway == 'yes' and tags['oneway:bicycle'] ~= 'no' then
    presence[LEFT_SIGN] = presence[LEFT_SIGN] or 'not_expected'
  end

  -- Replace all nil values with 'missing'
  for _, side in pairs(sides) do presence[side] = presence[side] or "missing" end

  local result_tags = {
    bikelane_left = presence[LEFT_SIGN],
    bikelane_self = presence[CENTER_SIGN],
    bikelane_right = presence[RIGHT_SIGN]
  }

  return result_tags
end
