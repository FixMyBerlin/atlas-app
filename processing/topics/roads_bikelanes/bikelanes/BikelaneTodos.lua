package.path = package.path .. ";/processing/topics/helper/?.lua"
require('ContainsSubstring')
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
  self.priority = args.priority
  self.conditions = args.conditions
  return self
end

function BikelaneTodo:__call(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return { id = self.id, priority = self.priority() }
  else
    return nil
  end
end

-- === Infrastructure ===
local needsClarification = BikelaneTodo.new({
  id = "needsClarification",
  desc = "Tagging insufficient to categorize the bike infrastructure.",
  priority = function(_, _) return "1" end,
  conditions = function(_, resultTags)
    return resultTags.category == "needsClarification"
  end
})
local adjoiningOrIsolated = BikelaneTodo.new({
  id = "adjoiningOrIsolated",
  desc = "Expected tag `is_sidepath=yes` or `is_sidepath=no`.",
  priority = function(_, _) return "1" end,
  conditions = function(_, resultTags)
    return ContainsSubstring(resultTags.category, '_adjoiningOrIsolated')
  end
})
local advisoryOrExclusive = BikelaneTodo.new({
  id = "advisoryOrExclusive",
  desc = "Expected tag `cycleway:*:lane=advisory` or `exclusive`.",
  priority = function(_, _) return "1" end,
  conditions = function(_, resultTags)
    return ContainsSubstring(resultTags.category, '_advisoryOrExclusive')
  end
})

-- === Bicycle Roads ===
local missing_traffic_sign_vehicle_destination = BikelaneTodo.new({
  id = "missing_traffic_sign_vehicle_destination",
  desc = "Expecting tag traffic_sign 'Anlieger frei' `traffic_sign=DE:244.1,1020-30` or similar.",
  priority = function(_, _) return "1" end,
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
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    return objectTags.bicycle_road == "yes"
        and not ContainsSubstring(objectTags.traffic_sign, '244')
        and not missing_traffic_sign_vehicle_destination(objectTags)
  end
})
local missing_access_tag_bicycle_road = BikelaneTodo.new({
  id = "missing_access_tag_bicycle_road",
  desc = "Expected access tag `bicycle=designated` that is required for routing.",
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    return objectTags.bicycle_road == "yes"
        -- Only check `vehicle` because `motor_vehicle` does allow `bicycle` already.
        -- However the wiki recomments `vehicle` over `motor_vehicle`, so once that is fixed this will trigger again.
        and (objectTags.vehicle == "no" or objectTags.vehicle == "destination")
        and objectTags.bicycle ~= 'designated'
  end
})
-- IDEA: Check if `motor_vehicle=*` instead of `vehicle=*` was used (https://wiki.openstreetmap.org/wiki/Tag:bicycle_road%3Dyes, https://wiki.openstreetmap.org/wiki/Key:access#Land-based_transportation)

-- === Traffic Signs ===
local missing_traffic_sign_but_bicycle_designated = BikelaneTodo.new({
  id = "missing_traffic_sign_but_bicycle_designated",
  desc = "Bicycle Infrastructure recognized with `bicycle=designated` but no `traffic_sign`.",
  priority = function(_, _) return "1" end,
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
  priority = function(_, _) return "1" end,
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
  priority = function(_, _) return "1" end,
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

-- === Bike- and Foot Path ===
local missing_access_tag_240 = BikelaneTodo.new({
  id = "missing_access_tag_240",
  desc = "Expected tag `bicycle=designated` and `foot=designated`.",
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    return (ContainsSubstring(objectTags.traffic_sign, '240') or ContainsSubstring(objectTags.traffic_sign, '241'))
        and objectTags.bicycle ~= 'designated'
        and objectTags.foot ~= "designated"
  end
})
-- TODO: If both bicycle=designated and foot=designated are present, check if the traffic_sign is 240 or 241.
local missing_segregated = BikelaneTodo.new({
  id = "missing_segregated",
  desc = "Expected tag `segregated=yes` or `segregated=no`.",
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, resultTags)
    return resultTags.category == "needsClarification"
        and (objectTags.segregated ~= "yes" or objectTags.segregated ~= "no")
        and (
          (objectTags.bicycle == "designated" and objectTags.foot == "designated")
          or ContainsSubstring( objectTags.traffic_sign, '240')
          or ContainsSubstring( objectTags.traffic_sign, '241')
        )
  end
})
local unexpected_bicycle_access_on_footway = BikelaneTodo.new({
  id = "unexpected_bicycle_access_on_footway",
  desc = "Expected `highway=path+bicycle=designated` (unsigned/explicit DE:240)" ..
    "or `highway=footway+bicycle=yes` (unsigned/explicit DE:239,1022-10);"..
    " Add traffic_sign=none to specify unsigned path.",
  priority = function(_, _) return "1" end,
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
  -- Infrastructure
  needsClarification,
  adjoiningOrIsolated,
  advisoryOrExclusive,
  -- Bicycle Roads
  missing_traffic_sign_vehicle_destination,
  missing_traffic_sign_244,
  missing_access_tag_bicycle_road,
  -- Traffic Signs
  missing_traffic_sign_but_bicycle_designated,
  missing_traffic_sign_but_bicycle_yes,
  missing_traffic_sign,
  -- Bike- and Foot Path
  missing_access_tag_240,
  missing_segregated,
  unexpected_bicycle_access_on_footway,
}
