
-- PREDICATES FOR EACH CATEGORY:
-- maybe switch to returning the category instead of mutating the input

-- Handle `highway=pedestrian + bicycle=yes/!=yes`
-- Include "Fußgängerzonen" only when explicitly allowed for bikes. "dismount" does counts as "no"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dpedestrian
local function pedestiranArea(tags)
  local results = tags.highway == "pedestrian" and tags.bicycle == "yes"
  if result then
    tags.category = "pedestrianArea_bicycleYes"
  end
  return results
end

-- Handle `highway=living_street`
-- DE: Verkehrsberuhigter Bereich AKA "Spielstraße"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dliving_street
local function livingStreet(tags)
  local result = tags.highway == "living_street" and not tags.bicycle == "no"
  if result then
    tags.category = "livingStreet"
  end
  return result
end

-- Handle `bicycle_road=yes` and traffic_sign
-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- tag: "bicycleRoad"
local function bicycleRoad(tags)
  local result = tags.bicycle_road == "yes" or StartsWith(tags.traffic_sign, "DE:244")
  if result then
    tags.category = "bicycleRoad"
  end
  return result
end

-- Handle "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:240
local function footAndCycleway(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "no"
  result = result or StartsWith(tags.traffic_sign, "DE:240")
  if result then
    tags.category = "footAndCycleway_shared"
  end
  return result
end

-- Handle "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-31
local function footAndCyclewaySegregated(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "yes"
  result = result or StartsWith(tags.traffic_sign, "DE:241")
  if result then
    tags.category = "footAndCycleway_segregated"
  end
  return result
end

-- Handle "Gehweg, Fahrrad frei"
-- traffic_sign=DE:239,1022-10, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:239
local function footwayBicycleAllowed(tags)
  local result = tags.highway == "footway" or tags.highway == "path"
  -- Note: We might be missing some traffic_sign that have mulibe secondary signs like "DE:239,123,1022-10". That's OK for now…
  -- Note: For ZES we explicity checked that the traffic_sign is not on a highway=cycleway; we do the same here but differently
  result = result and
      (tags.bicycle == "yes" or StartsWith(tags.traffic_sign, "DE:239,1022-10") or tags.traffic_sign == 'DE:1022-10')
  -- The access based tagging would include free running path through woods like https://www.openstreetmap.org/way/23366687
  -- We filter those based on mtb:scale=*.
  result = result and not tags["mtb:scale"]
  if result then
    tags.category = "footway_bicycleYes"
  end
  return result
end

-- Handle "baulich abgesetzte Radwege" ("Protected Bike Lane")
-- This part relies heavly on the `is_sidepath` tagging.
local function cyclewaySeparated(tags)
  -- Case: Separate cycleway next to a road
  --    Eg https://www.openstreetmap.org/way/278057274
  local result = (tags.highway == "cycleway" and tags.is_sidepath == "yes")
  -- Case: The crossing version of a separate cycleway next to a road
  -- The same case as the is_sidepath=yes above, but on crossings we don't set that.
  --    Eg https://www.openstreetmap.org/way/963592923
  result = result or (tags.highway == "cycleway" and tags.cycleway == "crossing")
  -- Case: Separate cycleway identified via traffic_sign
  -- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
  --    Eg https://www.openstreetmap.org/way/964476026
  -- Note: We do not check cycleway=lane (eg https://www.openstreetmap.org/way/761086733)
  --    since we consider this a separate cycleway.
  result = result or (tags.traffic_sign == "DE:237" and tags.is_sidepath == "yes")
  -- Case: Separate cycleway identified via "track"-tagging.
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dtrack
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_track
  result = result or (tags.cycleway == "track" or tags.cycleway == "opposite_track")

  if result then
    tags.category = "cyclewaySeparated"
  end
  return result
end

local function cyclewayOnHighway(tags)
  -- Case: Cycleway identified via "lane"-tagging, which means it is part of the highway.
  --    TBD: We might need to split of the cycleway=lane
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dlane
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_lane
  local result = tags.cycleway == "lane" or tags.cycleway == "opposite_lane"

  if result then
    tags.category = "cyclewayOnHighway"
  end
  return result
end

-- Handle "frei geführte Radwege", dedicated cycleways that are not next to a road
-- Eg. https://www.openstreetmap.org/way/27701956
-- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
-- tag: "cyclewayAlone"
local function cycleWayAlone(tags)
  local result = tags.highway == "cycleway" and tags.traffic_sign == "DE:237"
  result = result and (tags.is_sidepath == nil or tags.is_sidepath == "no")
  if result then
    tags.category = "cyclewayAlone"
  end
  return result
end

function BikelaneCategory(tags)
  local categories = { pedestiranArea, livingStreet, bicycleRoad, footAndCycleway, footAndCyclewaySegregated,
  footwayBicycleAllowed, cyclewaySeparated, cyclewayOnHighway, cycleWayAlone }
  for _, predicate in pairs(categories) do
    if predicate(tags) then
      return true
    end
  end
  return false
end
