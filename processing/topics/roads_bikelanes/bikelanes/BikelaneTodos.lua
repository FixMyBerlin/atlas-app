package.path = package.path .. ";/processing/topics/helper/?.lua"
require('ContainsSubstring')
require('SanitizeTrafficSign')
-- local inspect = require('inspect')
BikelaneTodo = {}
BikelaneTodo.__index = BikelaneTodo

-- @param args table
-- @param args.id string
-- @param args.desc string
-- @param args.todoTableOnly boolean
-- @param args.conditions function
function BikelaneTodo.new(args)
  local self = setmetatable({}, BikelaneTodo)
  self.id = args.id
  self.desc = args.desc
  self.todoTableOnly = args.todoTableOnly
  self.priority = args.priority
  self.conditions = args.conditions
  return self
end

function BikelaneTodo:__call(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return {
      id = self.id,
      priority = self.priority(objectTags, resultTags),
      todoTableOnly = self.todoTableOnly,
    }
  else
    return nil
  end
end


-- === Bicycle Roads ===
local missing_traffic_sign_vehicle_destination = BikelaneTodo.new({
  id = "missing_traffic_sign_vehicle_destination",
  desc = "Expecting tag traffic_sign 'Anlieger frei' `traffic_sign=DE:244.1,1020-30` or similar.",
  todoTableOnly = true,
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
  todoTableOnly = true,
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
  todoTableOnly = false,
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
local malformed_traffic_sign = BikelaneTodo.new({
  id = "malformed_traffic_sign",
  desc = "Traffic sign tag needs cleaning up.",
  todoTableOnly = true,
  priority = function(_, _) return 1 end,
  conditions = function(objectTags, resultTags)
    if (resultTags.category == nil) then return false end

    -- Compare raw with sanatized tag and create 'todo' if different
    if objectTags['traffic_sign'] ~= SanitizeTrafficSign(objectTags['traffic_sign']) then return true end
    if objectTags['traffic_sign:forward'] ~= SanitizeTrafficSign(objectTags['traffic_sign:forward']) then return true end
    if objectTags['traffic_sign:backward'] ~= SanitizeTrafficSign(objectTags['traffic_sign:backward']) then return true end
    return false
  end
})
local missing_traffic_sign = BikelaneTodo.new({
  id = "missing_traffic_sign",
  desc = "Expected tag `traffic_sign=DE:*` or `traffic_sign=none`.",
  todoTableOnly = true,
  priority = function(objectTags, _)
    if objectTags.bicycle == "designated" then return "1" end
    if objectTags.bicycle == "yes" then return "2" end
    return "3"
  end,
  conditions = function(objectTags, resultTags)
    local traffic_sign = objectTags['traffic_sign'] or objectTags['traffic_sign:forward'] or objectTags['traffic_sign:backward']
    return traffic_sign == nil
      and not (
        missing_traffic_sign_244(objectTags) or
        missing_traffic_sign_vehicle_destination(objectTags)
        -- Add any new missing_traffic_sign_* here so we only trigger this TODO when no other traffic_sign todo is present.
      )
      and resultTags.category ~= 'cyclwayLink'
      and resultTags.category ~= 'crossing'
      and resultTags.category ~= 'needsClarification'
  end
})

-- === Bike- and Foot Path ===
local missing_access_tag_240 = BikelaneTodo.new({
  id = "missing_access_tag_240",
  desc = "Expected tag `bicycle=designated` and `foot=designated`.",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    return (ContainsSubstring(objectTags.traffic_sign, '240') or ContainsSubstring(objectTags.traffic_sign, '241'))
        and objectTags.bicycle ~= 'designated'
        and objectTags.foot ~= "designated"
        and objectTags.cycleway ~= 'track'
        and objectTags.cycleway ~= 'lane'
  end
})
-- TODO: If both bicycle=designated and foot=designated are present, check if the traffic_sign is 240 or 241.
local missing_segregated = BikelaneTodo.new({
  id = "missing_segregated",
  desc = "Expected tag `segregated=yes` or `segregated=no`.",
  todoTableOnly = false,
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
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, resultTags)
    return objectTags.highway == 'footway'
      and objectTags.bicycle == 'designated'
      and resultTags.category == 'needsClarification'
  end
})

-- === Infrastructure ===
local needs_clarification = BikelaneTodo.new({
  id = "needs_clarification",
  desc = "Tagging insufficient to categorize the bike infrastructure.",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, resultTags)
    return resultTags.category == "needsClarification"
      and not (
        objectTags.cycleway == "shared" or -- Handled by RoadTodos.lua `deprecated_cycleway_shared`
        unexpected_bicycle_access_on_footway(objectTags, resultTags)
      )
  end
})
-- Name is not precise anymore since we only include one sub-category here.
-- Background: https://github.com/FixMyBerlin/private-issues/issues/2081#issuecomment-2656458701
local adjoining_or_isolated = BikelaneTodo.new({
  id = "adjoining_or_isolated",
  desc = "Only for category=cycleway_adjoiningOrIsolated for now. Expected tag `is_sidepath=yes` or `is_sidepath=no`.",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(_, resultTags)
    return resultTags.category == 'cycleway_adjoiningOrIsolated'
  end
})
local advisory_or_exclusive = BikelaneTodo.new({
  id = "advisory_or_exclusive",
  desc = "Expected tag `cycleway:*:lane=advisory` or `exclusive`.",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, resultTags)
    if ContainsSubstring(resultTags.category, '_advisoryOrExclusive') == false then return false end
    if objectTags._parent == nil then return false end
    -- We only want one task per centerline, we pick the "right" side
    return (objectTags._parent['cycleway:both'] == "lane" and objectTags._side == "right")
        or (objectTags._parent['cycleway'] == "lane" and objectTags._side == "right")
        or (objectTags._parent['cycleway:right'] == "lane" and objectTags._side == "right")
        or (objectTags._parent['cycleway:left'] == "lane" and objectTags._parent['cycleway:right'] ~= "lane" and objectTags._side == "left")
  end
})
local needs_clarification_track = BikelaneTodo.new({
  id = "needs_clarification_track",
  desc = "Tagging `cycleway=track` insufficient to categorize the bike infrastructure`.",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    if objectTags._parent == nil then return false end

    -- Some cases are tagged sufficiently with `cycleway:SIDE:segregated` or `cycleway:SIDE:traffic_signs`
    -- It is hard to check both sides propery. This will error on the side of caution.
    local segregated = objectTags._parent['cycleway:both:segregated'] or objectTags._parent['cycleway:left:segregated'] or objectTags._parent['cycleway:right:segregated']
    if segregated == "yes" or segregated == "no" then return false end
    local traffic_sign = objectTags._parent['cycleway:both:traffic_sign'] or objectTags._parent['cycleway:left:traffic_sign'] or objectTags._parent['cycleway:right:traffic_sign']
    if ContainsSubstring(traffic_sign, '240') or ContainsSubstring(traffic_sign, '241') then return false end

    -- We only want one task per centerline, we pick the "right" side
    return (objectTags._parent['cycleway:both'] == "track" and objectTags._side == "right")
        or (objectTags._parent['cycleway'] == "track" and objectTags._side == "right")
        or (objectTags._parent['cycleway:right'] == "track" and objectTags._side == "right")
        or (objectTags._parent['cycleway:left'] == "track" and objectTags._parent['cycleway:right'] ~= "track" and objectTags._side == "left")
  end
})
local mixed_cycleway_both = BikelaneTodo.new({
  id = "mixed_cycleway_both",
  desc = "Mixed tagging of cycleway=* or cycleway:both=* with cycleway:SIDE",
  todoTableOnly = false,
  priority = function(_, _) return "1" end,
  conditions = function(objectTags, _)
    if objectTags._parent == nil then return false end
    -- We only want one task per centerline, we pick the "right" side
    if objectTags._side ~= "right" then return false end
    -- NOTE: This will trigger on "no" values. Which is OK, because the mix of "both" and "SIDE" is still not ideal.
    return (objectTags._parent['cycleway:both'] ~= nil and (objectTags._parent['cycleway:left'] ~= nil or objectTags._parent['cycleway:right'] ~= nil))
        or (objectTags._parent['cycleway'] ~= nil and (objectTags._parent['cycleway:left'] ~= nil or objectTags._parent['cycleway:right'] ~= nil))
  end
})

-- === Other ===
local days_in_year = 365
local currentness_too_old = BikelaneTodo.new({
  id = "currentness_too_old",
  desc = "Infrastructure that has not been edited for about 7 years",
  todoTableOnly = true,
  priority = function(_, resultTags)
    if resultTags._updated_age >= days_in_year * 15 then return "1" end
    if resultTags._updated_age >= days_in_year * 12 then return "2" end
    return "3"
  end,
  conditions = function(_, resultTags)
    -- Sync date with `app/src/app/regionen/[regionSlug]/_mapData/mapDataSubcategories/mapboxStyles/groups/radinfra_currentness.ts`
    return resultTags.category ~= nil and resultTags._updated_age ~= nil and resultTags._updated_age >= days_in_year*10
  end
})
local missing_width = BikelaneTodo.new({
  id = "missing_width",
  desc = "Ways without `width`",
  todoTableOnly = true,
  priority = function(_, _) return "1" end,
  conditions = function(_, resultTags)
    return resultTags.width == nil
      and resultTags.category ~= 'cyclwayLink'
      and resultTags.category ~= 'sharedBusLaneBikeWithBus'
      and resultTags.category ~= 'sharedBusLaneBusWithBike'
      and resultTags.category ~= 'crossing'
      and resultTags.category ~= 'pedestrianAreaBicycleYes'
      and resultTags.category ~= 'footAndCyclewayShared_isolated'
      and resultTags.category ~= 'footAndCyclewayShared_adjoiningOrIsolated'
      and resultTags.category ~= 'needsClarification'
  end
})
local missing_surface = BikelaneTodo.new({
  id = "missing_surface",
  desc = "Ways without `surface`",
  todoTableOnly = true,
  priority = function(_, resultTags)
    if resultTags.category == 'crossing' then return "2" end
    return "1"
  end,
  conditions = function(_, resultTags)
    return resultTags.surface == nil
      and resultTags.category ~= 'cyclwayLink'
      and resultTags.category ~= 'needsClarification'
  end
})

BikelaneTodos = {
  -- REMINDER: Always use snake_case, never camelCase
  -- Infrastructure
  needs_clarification,
  adjoining_or_isolated,
  advisory_or_exclusive,
  needs_clarification_track,
  mixed_cycleway_both,
  -- Bicycle Roads
  missing_traffic_sign_vehicle_destination,
  missing_traffic_sign_244,
  missing_access_tag_bicycle_road,
  -- Traffic Signs
  missing_traffic_sign,
  malformed_traffic_sign,
  -- Bike- and Foot Path
  missing_access_tag_240,
  missing_segregated,
  unexpected_bicycle_access_on_footway,
  -- Other
  currentness_too_old,
  missing_width,
  missing_surface,
}
