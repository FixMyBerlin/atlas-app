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
  conditions = function(tagsObject, _)
    return tagsObject.bicycle_road == "yes"
        and (tagsObject.vehicle == "destination" or tagsObject.motor_vehicle == "destination")
            and not IsTermInString("1020-30", tagsObject.traffic_sign)
  end
})
-- Note: We ignore the misstagging of `motor_vehicle` instead of `vehicle` as it is currently hard to map in iD and not that relevant for routing.
local missing_traffic_sign_244 = BikelaneTodo.new({
  id = "missing_traffic_sign_244",
  desc = "Expecting tag `traffic_sign=DE:244.1` or similar.",
  conditions = function(tagsObject, _)
    return tagsObject.bicycle_road == "yes"
        and not IsTermInString('244', tagsObject.traffic_sign)
        and not missing_traffic_sign_vehicle_destination(tagsObject)
  end
})
local missing_acccess_tag_bicycle_road = BikelaneTodo.new({
  id = "missing_acccess_tag_bicycle_road",
  desc = "Expected access tag `bicycle=designated` that is required for routing.",
  conditions = function(tagsObject, _)
    return tagsObject.bicycle_road == "yes"
        -- Only check `vehicle` because `motor_vehicle` does exclude `bicycle` already.
        -- However the wiki recomments `vehicle` over `motor_vehicle`, so once that is fixed this will trigger again.
        and (tagsObject.vehicle == "no" or tagsObject.vehicle == "destination")
        and tagsObject.bicycle ~= 'designated'
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
  end
})
local missing_traffic_sign_but_bicycle_yes = BikelaneTodo.new({
  id = "missing_traffic_sign_but_bicycle_yes",
  desc = "Bicycle Infrastructure recognized with `bicycle=yes` but no `traffic_sign`.",
  conditions = function(objectTags, resultTags)
    return resultTags.category ~= nil
      and objectTags.bicycle == "yes"
  end
})
local missing_traffic_sign = BikelaneTodo.new({
  id = "missing_traffic_sign",
  desc = "Expected tag `traffic_sign=DE:*` or `traffic_sign=none`.",
  conditions = function(tagsObject, resultTags)
    return tagsObject.traffic_sign == nil
        and not (
          missing_traffic_sign_244(tagsObject) or
          missing_traffic_sign_vehicle_destination(tagsObject) or
          missing_traffic_sign_but_bicycle_designated(tagsObject, resultTags) or
          missing_traffic_sign_but_bicycle_yes(tagsObject, resultTags)
          -- Add any missing_traffic_sign_* here so we only trigger this TODO when no other traffic_sign todo is present.
        )
  end
})

-- === Fuß- und Radweg ===
local missing_access_tag_240 = BikelaneTodo.new({
  id = "missing_access_tag_240",
  desc = "Expected tag `bicycle=designated` and `foot=designated`.",
  conditions = function(tagsObject, _)
    return (IsTermInString('240', tagsObject.traffic_sign) or IsTermInString('241', tagsObject.traffic_sign))
        and tagsObject.bicycle ~= 'designated'
        and tagsObject.foot ~= "designated"
  end
})
-- TODO: If both bicycle=designated and foot=designated are present, check if the traffic_sign is 240 or 241.
local missing_segregated = BikelaneTodo.new({
  id = "missing_segregated",
  desc = "Expected tag `segregated=yes` or `segregated=no`.",
  conditions = function(tagsObject, resultTags)
    return resultTags.category == "needsClarification"
        and (
          (tagsObject.bicycle == "designated" and tagsObject.foot == "designated")
          or osm2pgsql.has_prefix(tagsObject.traffic_sign, "DE:240")
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


BikelaneTodos = {
  missing_traffic_sign,
  missing_traffic_sign_244,
  missing_traffic_sign_vehicle_destination,
  missing_acccess_tag_bicycle_road,
  missing_traffic_sign_but_bicycle_designated,
  missing_traffic_sign_but_bicycle_yes,
  missing_traffic_sign,
  missing_access_tag_240,
  missing_segregated,
  missing_sidepath,
  missing_cycleway_lane
}
