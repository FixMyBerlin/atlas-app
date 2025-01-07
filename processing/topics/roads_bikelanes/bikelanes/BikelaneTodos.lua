package.path = package.path .. ";/processing/topics/helper/?.lua"
BikelaneTodo = {}
BikelaneTodo.__index = BikelaneTodo

-- @param args table
-- @param args.id string
-- @param args.desc string
-- @param args.conditions function
function BikelaneTodo.new(args)
  local self = setmetatable({}, BikelaneTodo)
  self.id = args.id
  self.desc = args.desc
  self.conditions = args.conditions
  return self
end

function BikelaneTodo:__call(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return self.id
  else
    return nil
  end
end

-- === Fahrradstraßen ===
local missing_traffic_sign_vehicle_destination = BikelaneTodo.new({
  id = "missing_traffic_sign_vehicle_destination",
  desc = "Expecting tag traffic_sign 'Anlieger frei' `traffic_sign=DE:244.1,1020-30` or similar.",
  conditions = function(objectTags, _)
    return objectTags.bicycle_road == "yes"
        and (objectTags.vehicle == "destination" or objectTags.motor_vehicle == "destination")
            and not ContainsSubstring(objectTags.traffic_sign, "1020-30")
  end
})
-- Note: We ignore the misstagging of `motor_vehicle` instead of `vehicle` as it is currently hard to map in iD and not that relevant for routing.
local missing_traffic_sign_244 = BikelaneTodo.new({
  id = "missing_traffic_sign_244",
  desc = "Expecting tag `traffic_sign=DE:244.1` or similar.",
  conditions = function(objectTags, _)
    return objectTags.bicycle_road == "yes"
        and not ContainsSubstring(objectTags.traffic_sign, '244')
        and not missing_traffic_sign_vehicle_destination(objectTags)
  end
})
local missing_acccess_tag_bicycle_road = BikelaneTodo.new({
  id = "missing_acccess_tag_bicycle_road",
  desc = "Expected access tag `bicycle=designated` that is required for routing.",
  conditions = function(objectTags, _)
    return objectTags.bicycle_road == "yes"
        -- Only check `vehicle` because `motor_vehicle` does allow `bicycle` already.
        -- However the wiki recomments `vehicle` over `motor_vehicle`, so once that is fixed this will trigger again.
        and (objectTags.vehicle == "no" or objectTags.vehicle == "destination")
        and objectTags.bicycle ~= 'designated'
  end
})
-- IDEA: Check if `motor_vehicle=*` instead of `vehicle=*` was used (https://wiki.openstreetmap.org/wiki/Tag:bicycle_road%3Dyes, https://wiki.openstreetmap.org/wiki/Key:access#Land-based_transportation)

-- === Verkehrszeichen ===
local missing_traffic_sign_but_bicycle_designated = BikelaneTodo.new({
  id = "missing_traffic_sign_but_bicycle_designated",
  desc = "Bicycle Infrastructure recognized with `bicycle=designated` but no `traffic_sign`.",
  conditions = function(objectTags, resultTags)
    return resultTags.category ~= nil
        and objectTags.bicycle == "designated"
        and (
          objectTags.traffic_sign == nil
          and objectTags['traffic_sign:forward'] == nil
          and objectTags['traffic_sign:backward'] == nil
        )
  end
})
local missing_traffic_sign_but_bicycle_yes = BikelaneTodo.new({
  id = "missing_traffic_sign_but_bicycle_yes",
  desc = "Bicycle Infrastructure recognized with `bicycle=yes` but no `traffic_sign`.",
  conditions = function(objectTags, resultTags)
    return resultTags.category ~= nil
        and objectTags.bicycle == "yes"
        and (
          objectTags.traffic_sign == nil
          and objectTags['traffic_sign:forward'] == nil
          and objectTags['traffic_sign:backward'] == nil
        )
  end
})
local missing_traffic_sign = BikelaneTodo.new({
  id = "missing_traffic_sign",
  desc = "Expected tag `traffic_sign=DE:*` or `traffic_sign=none`.",
  conditions = function(objectTags, resultTags)
    local traffic_sign = objectTags['traffic_sign'] or objectTags['traffic_sign:forward'] or objectTags['traffic_sign:backward']
    return traffic_sign == nil
        and not (
          missing_traffic_sign_244(objectTags) or
          missing_traffic_sign_vehicle_destination(objectTags) or
          missing_traffic_sign_but_bicycle_designated(objectTags, resultTags) or
          missing_traffic_sign_but_bicycle_yes(objectTags, resultTags)
          -- Add any missing_traffic_sign_* here so we only trigger this TODO when no other traffic_sign todo is present.
        )
  end
})

-- === Fuß- und Radweg ===
local missing_access_tag_240 = BikelaneTodo.new({
  id = "missing_access_tag_240",
  desc = "Expected tag `bicycle=designated` and `foot=designated`.",
  conditions = function(objectTags, _)
    return (ContainsSubstring( objectTags.traffic_sign, '240') or ContainsSubstring(objectTags.traffic_sign, '241'))
        and objectTags.bicycle ~= 'designated'
        and objectTags.foot ~= "designated"
  end
})
-- TODO: If both bicycle=designated and foot=designated are present, check if the traffic_sign is 240 or 241.
local missing_segregated = BikelaneTodo.new({
  id = "missing_segregated",
  desc = "Expected tag `segregated=yes` or `segregated=no`.",
  conditions = function(objectTags, resultTags)
    return resultTags.category == "needsClarification"
        and (
          (objectTags.bicycle == "designated" and objectTags.foot == "designated")
          or osm2pgsql.has_prefix(objectTags.traffic_sign, "DE:240")
        )
  end
})

-- === Sidepath ===
local missing_sidepath = BikelaneTodo.new({
  id = "missing_sidepath",
  desc = "Expected tag `is_sidepath=yes` or `is_sidepath=no`.",
  conditions = function(_, resultTags)
    return resultTags.category == "footAndCyclewayShared_adjoiningOrIsolated"
        or resultTags.category == "footAndCyclewaySegregated_adjoiningOrIsolated"
        or resultTags.category == "footwayBicycleYes_adjoiningOrIsolated"
        or resultTags.category == "cycleway_adjoiningOrIsolated"
  end
})

-- === cycleway:side=lane subcategory ===
local missing_cycleway_lane = BikelaneTodo.new({
  id = "missing_cycleway_lane",
  desc = "Expected tag `cycleway:lane=advisory` or `cycleway:lane=exclusive`.",
  conditions = function(_, resultTags)
    return resultTags.category == "cyclewayOnHighway_advisoryOrExclusive"
  end
})

-- === cycleway=shared subcategory ===
local deprecated_cycleway_shared = BikelaneTodo.new({
  id = "deprecated_cycleway_shared",
  desc = "The tagging `cycleway=shared` is deprecated.",
  conditions = function(objectTags, _)
    return objectTags.cycleway == "shared"
  end
})

local unexpected_bicycle_access_on_footway = BikelaneTodo.new({
  id = "unexpected_bicycle_access_on_footway",
  desc = "Expected `highway=path+bicycle=designated` (unsigned/explicit DE:240)" ..
    "or `highway=footway+bicycle=yes` (unsigned/explicit DE:239,1022-10);"..
    " Add traffic_sign=none to specify unsigned path.",
  conditions = function(objectTags, resultTags)
    if objectTags.highway == 'footway'
      and objectTags.bicycle == 'designated'
      and resultTags.category == 'needsClarification'
    then
      return true
    end
  end
})

BikelaneTodos = {
  missing_traffic_sign,
  missing_traffic_sign_244,
  missing_traffic_sign_vehicle_destination,
  missing_acccess_tag_bicycle_road,
  missing_traffic_sign_but_bicycle_designated,
  missing_traffic_sign_but_bicycle_yes,
  missing_access_tag_240,
  missing_segregated,
  missing_sidepath,
  missing_cycleway_lane,
  deprecated_cycleway_shared,
  unexpected_bicycle_access_on_footway
}
