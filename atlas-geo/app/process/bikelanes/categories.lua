-- PREDICATES FOR EACH CATEGORY:

-- this category is for the explicit absence of bike infrastrucute
-- TODO: split into `no` or `separate`
local function dataNo(tags)
  if tags.cycleway == 'no' or tags.cycleway == 'separate' then
    return "data_no"
  end
end

-- for oneways we assume that the tag `cycleway=*` significates that there's one bike line on the left
-- TODO: this assumes right hand traffic (would be nice to specify this as an option)
local function implicitOneWay(tags)
  local result = tags.parent ~= nil and tags.prefix == 'cycleway' and tags.side == '' -- object is created from implicit case
  result = result and tags.parent.oneway == 'yes' and tags.parent['oneway:bicycle'] ~= 'no' -- is oneway w/o bike exception
  result = result and tags.sign == LEFT_SIGN
  if result then
    return 'not_expected'
  end
end

-- Handle `highway=pedestrian + bicycle=yes/!=yes`
-- Include "Fußgängerzonen" only when explicitly allowed for bikes. "dismount" does counts as "no"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dpedestrian
local function pedestiranArea(tags)
  local result = tags.highway == "pedestrian" and tags.bicycle == "yes"
  if result then
    return "pedestrianArea_bicycleYes"
  end
end

-- Handle `highway=living_street`
-- DE: Verkehrsberuhigter Bereich AKA "Spielstraße"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dliving_street
local function livingStreet(tags)
  local result = tags.highway == "living_street" and not tags.bicycle == "no"
  if result then
    return "livingStreet"
  end
end

-- Handle `bicycle_road=yes` and traffic_sign
-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- tag: "bicycleRoad"
local function bicycleRoad(tags)
  local result = tags.bicycle_road == "yes" or StartsWith(tags.traffic_sign, "DE:244")
  if result then
    return "bicycleRoad"
  end
end

-- Handle "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:240
local function footAndCycleway(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "no"
  result = result or StartsWith(tags.traffic_sign, "DE:240")
  if result then
    return "footAndCycleway_shared"
  end
end

-- Handle "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-31
local function footAndCyclewaySegregated(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "yes"
  result = result or StartsWith(tags.traffic_sign, "DE:241")
  if result then
    return "footAndCycleway_segregated"
  end
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
    return "footway_bicycleYes"
  end
end

-- Handle "baulich abgesetzte Radwege" ("Protected Bike Lane")
-- This part relies heavly on the `is_sidepath` tagging.
local function cyclewaySeparated(tags)

  -- Case: Separate cycleway identified via traffic_sign
  -- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
  -- (Note: cycleway==track is not very common)
  --    Eg https://www.openstreetmap.org/way/964476026
  local result = tags.traffic_sign == "DE:237" and tags.is_sidepath == "yes"
  result = result and (tags.cycleway == "track" or tags.cycleway == "opposite_track")
  if tags.highway == "cycleway" then
    -- Case: Separate cycleway next to a road
    --    Eg https://www.openstreetmap.org/way/278057274
    result = result or tags.is_sidepath == "yes"
    -- Case: The crossing version of a separate cycleway next to a road
    -- The same case as the is_sidepath=yes above, but on crossings we don't set that.
    --    Eg https://www.openstreetmap.org/way/963592923
    result = result or tags.cycleway == "crossing"
    -- Case: Separate cycleway identified via "track"-tagging. Only handle through center line!
    --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dtrack
    --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_track
    result = result or tags.cycleway == "track" or tags.cycleway == "opposite_track"
    -- Case: Separate cycleway
    --    https://www.openstreetmap.org/way/989837901/
    result = result or tags.bicycle == 'yes' or tags.bicycle == "designated" and (tags.foot == "no" or tags.foot == nil) -- maybe use foot ~= yes instead
  end
  if result then
    return "cyclewaySeparated"
  end
end

local function cyclewayOnHighway(tags)
  -- Case: Cycleway identified via "lane"-tagging, which means it is part of the highway.
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dlane
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_lane

  -- https://wiki.openstreetmap.org/w/index.php?title=Tag:cycleway%3Dshared_lane&uselang=en
  if result then
    return "cyclewayOnHighway"
  end
end

-- Handle "frei geführte Radwege", dedicated cycleways that are not next to a road
-- Eg. https://www.openstreetmap.org/way/27701956
-- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
-- tag: "cyclewayAlone"
local function cyclewayAlone(tags)
  local result = tags.highway == "cycleway" and tags.traffic_sign == "DE:237"
  result = result and (tags.is_sidepath == nil or tags.is_sidepath == "no")
  if result then
    return "cyclewayAlone"
  end
end

local function cyclewayBuslane(tags)
  -- TODO: check for other cases
  local result = tags.highway == "cycleway"
  result = result and tags.cycleway == "share_busway" or tags.cycleway == "opposite_share_busway"
  if result then
    return "cyclewayAlone"
  end
end

local function defineCategory(tags, categories)
  for _, predicate in pairs(categories) do
    local category = predicate(tags)
    if category ~= nil then
      return category
    end
  end
  return nil
end

-- Categories for objects where no infrastructure is available but the data is considered complete
function OnlyPresent(tags)
  local dataCategories = { dataNo, implicitOneWay}
  return defineCategory(tags, dataCategories)
end

function CategorizeBikelane(tags)
  local categories = { pedestiranArea, livingStreet, bicycleRoad, footAndCycleway,
    footAndCyclewaySegregated,
    footwayBicycleAllowed, cyclewaySeparated, cyclewayOnHighway, cyclewayAlone, cyclewayBuslane }
  return defineCategory(tags, categories)
end
