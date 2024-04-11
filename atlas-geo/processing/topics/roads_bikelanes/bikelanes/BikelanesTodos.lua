TodoIssue = {}
TodoIssue.__index = TodoIssue

function TodoIssue.new(identifier, description, conditionFunc)
  local self = setmetatable({}, TodoIssue)
  self.identifier = identifier
  self.description = description
  self.conditionFunc = conditionFunc
  return self
end

function TodoIssue:checkCondition(objectTags, resultTags)
  if self.conditionFunc(objectTags, resultTags) then
    return self.identifier
  else
    return nil
  end
end

-- === Fahrradstraßen ===
local missing_traffic_sign_244 = TodoIssue.new(
  "missing_traffic_sign_244",
  "Expecting tag `traffic_sign=DE:244.1` or similar.",
  function(tagsObject, _)
    return tagsObject.bicycle_road == "yes" and not IsTermInString('DE:244.1', tagsObject.traffic_sign)
  end
)
local missing_traffic_sign_vehicle_destination = TodoIssue.new(
  "missing_traffic_sign_vehicle_destination",
  "Expecting tag traffic_sign 'Anlieger frei' `traffic_sign=DE:244.1,1020-30` or similar.",
  function(tagsObject, _)
    return tagsObject.bicycle_road == "yes"
        and tagsObject.vehicle == "destination"
        and IsTermInString("1020-30", tagsObject.traffic_sign)
  end
)
local missing_acccess_tag_bicycle_road = TodoIssue.new(
  "missing_acccess_tag_bicycle_road",
  "Expected access tag `bicycle=designated` that is required for routing.",
  function(tagsObject, _)
    return tagsObject.bicycle_road == "yes"
        and (tagsObject.vehicle == "no" or tagsObject.vehicle == "destination")
        and tagsObject.bicycle == 'designated'
  end
)

-- === Verkehrszeichen ===
local missing_traffic_sign = TodoIssue.new(
  "missing_traffic_sign",
  "Expected tag `traffic_sign=DE:*` or `traffic_sign=none`.",
  function(tagsObject, _)
    return tagsObject.traffic_sign == nil
        and not (
          missing_traffic_sign_244:checkCondition(tagsObject) or
          missing_traffic_sign_vehicle_destination:checkCondition(tagsObject)
        )
  end
)

-- === Fuß- und Radweg ===
local missing_access_tag_240 = TodoIssue.new(
  "missing_access_tag_240",
  "Expected tag `bicycle=designated` and `foot=designated`.",
  function(tagsObject, _)
    return (IsTermInString('DE:240', tagsObject.traffic_sign) or IsTermInString('DE:241', tagsObject.traffic_sign))
        and tagsObject.bicycle ~= 'designated' and tagsObject.foot ~= "designated"
  end
)
local missing_segregated = TodoIssue.new(
  "missing_segregated",
  "Expected tag `segregated=yes` or `segregated=no`.",
  function(tagsObject, resultTags)
    return resultTags.category == "needsClarification"
        and (
          (tagsObject.bicycle == "designated" and tagsObject.foot == "designated")
          or osm2pgsql.has_prefix(tagsObject.traffic_sign, "DE:240")
        )
  end
)

-- === Sidepath ===
local missing_sidepath = TodoIssue.new(
  "missing_sidepath",
  "Expected tag `is_sidepath=yes` or `is_sidepath=no`.",
  function(_, resultTags)
    return resultTags.category == "footAndCyclewayShared_adjoiningOrIsolated"
        or resultTags.category == "footAndCyclewaySegregated_adjoiningOrIsolated"
        or resultTags.category == "footwayBicycleYes_adjoiningOrIsolated"
        or resultTags.category == "cycleway_adjoiningOrIsolated"
  end
)

-- === cycleway:side=lane subcategory ===
local missing_cycleway_lane = TodoIssue.new(
  "missing_cycleway_lane",
  "Expected tag `cycleway:lane=advisory` or `cycleway:lane=exclusive`.",
  function(_, resultTags)
    return resultTags.category == "cyclewayOnHighway_advisoryOrExclusive"
  end
)

-- Public funtion
function BikelanesTodos(tagsObject, resultTags)
  local todos = {}

  todos[#todos + 1] = missing_traffic_sign:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_traffic_sign_244:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_traffic_sign_vehicle_destination:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_acccess_tag_bicycle_road:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_access_tag_240:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_segregated:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_sidepath:checkCondition(tagsObject, resultTags)
  todos[#todos + 1] = missing_cycleway_lane:checkCondition(tagsObject, resultTags)

  return RemoveNilValues(todos)
end

function RemoveNilValues(t)
  local result = {}
  for _, v in ipairs(t) do
    if v ~= nil then
      result[#result + 1] = v
    end
  end
  return result
end
