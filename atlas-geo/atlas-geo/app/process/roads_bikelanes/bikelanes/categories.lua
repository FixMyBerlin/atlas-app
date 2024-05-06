package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/categories/?.lua"
require("IsTermInString")
require("IsSidepath")

-- this category is for the explicit absence of bike infrastrucute
local function dataNo(tags)
  local nos = Set({ 'no', 'none' })
  if nos[tags.cycleway] then
    return "data_no"
  end
end

local function isSeparate(tags)
  if tags.cycleway == 'separate' then
    return 'separate_geometry'
  end
end

-- for oneways we assume that the tag `cycleway=*` significates that there's one bike line on the left
-- TODO: this assumes right hand traffic (would be nice to specify this as an option)
local function implicitOneWay(tags)
  local result = tags._prefix == 'cycleway' and tags._infix == '' -- object is created from implicit case
  result = result and tags._parent.oneway == 'yes' and
      tags._parent['oneway:bicycle'] ~= 'no'                    -- is oneway w/o bike exception
  result = result and tags._side == "left"                   -- is the left side object
  if result then
    return 'not_expected'
  end
end

-- Handle `highway=pedestrian + bicycle=yes/!=yes`
-- Include "Fußgängerzonen" only when explicitly allowed for bikes. "dismount" does counts as "no"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dpedestrian
local function pedestrianAreaBicycleYes(tags)
  -- area=yes is allowed; all other category disallow it
  if tags.highway == "pedestrian" and tags.bicycle == "yes" then
    return "pedestrianAreaBicycleYes"
  end
end

-- Handle `highway=living_street`
-- DE: Verkehrsberuhigter Bereich AKA "Spielstraße"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dliving_street
local function livingStreet(tags)
  if tags.highway == "living_street" then
    -- No vehicle except bicycles
    if tags.vehicle == "no" and not tags.bicycle == "yes" then
      return "livingStreet"
    end
    -- Nothing about vehicle but bicycle=yes or similar
    if (tags.vehicle == nil or tags.vehicle == "yes")
        and not tags.bicycle == "no" then
      return "livingStreet"
    end
  end
end

-- Handle `bicycle_road=yes` and traffic_sign
-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- traffic_sign=DE:244, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:244
local function bicycleRoad(tags)
  if tags.bicycle_road == "yes"
      or osm2pgsql.has_prefix(tags.traffic_sign, 'DE:244') then
    -- Subcategory when bicycle road allows vehicle traffic
    if tags.traffic_sign == 'DE:244.1,1020-30'
        or tags.traffic_sign == 'DE:244,1020-30'
        or tags.vehicle == 'destination'
        or tags.motor_vehicle == 'destination' then
      return "bicycleRoad_vehicleDestination"
    end

    return "bicycleRoad"
  end
end

-- Handle "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:240
local function footAndCyclewaySharedCases(tags)
  if tags.area == "yes" then return end
  local taggedWithAccessTagging = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "no"
  local taggedWithTrafficsign = osm2pgsql.has_prefix(tags.traffic_sign, "DE:240")
  if taggedWithAccessTagging or taggedWithTrafficsign then
    if IsSidepath(tags) then
      return "footAndCyclewayShared_adjoining"
    end
    -- Eg https://www.openstreetmap.org/way/440072364 highway=service
    if tags.is_sidepath == "no" or tags.highway == "service" then
      return "footAndCyclewayShared_isolated"
    end
    return "footAndCyclewayShared_adjoiningOrIsolated"
  end
end

-- Handle "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-31
local function footAndCyclewaySegregatedCases(tags)
  if tags.area == "yes" then return end
  local taggedWithAccessTagging = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "yes"
  local taggedWithTrafficsign = osm2pgsql.has_prefix(tags.traffic_sign, "DE:241")
  if taggedWithAccessTagging or taggedWithTrafficsign then
    if IsSidepath(tags) then
      return "footAndCyclewaySegregated_adjoining"
    end
    if tags.is_sidepath == "no" then
      return "footAndCyclewaySegregated_isolated"
    end
    return "footAndCyclewaySegregated_adjoiningOrIsolated"
  end
end

-- Case: "Gehweg, Fahrrad frei"
-- traffic_sign=DE:1022-10 "Fahrrad frei", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:239
local function footwayBicycleYesCases(tags)
  -- mtb:scale=* is a strong indicator for path' that we do not want to show, so we skip them;
  --    This will likely need a better solution in the future.
  --    Eg https://www.openstreetmap.org/way/23366687
  if tags["mtb:scale"] then return end
  if tags.area == "yes" then return end

  if tags.highway == "footway" or tags.highway == "path" then
    if tags.bicycle == "yes" or IsTermInString("1022-10", tags.traffic_sign) then
      if IsSidepath(tags) then
        return "footwayBicycleYes_adjoining"
      end
      -- https://www.openstreetmap.org/way/946438663
      if tags.is_sidepath == "no" then
        return "footwayBicycleYes_isolated"
      end
      return "footwayBicycleYes_adjoiningOrIsolated"
    end
  end
end

-- Handle different cases for separated bikelanes ("baulich abgesetzte Radwege")
-- The sub-tagging specifies if the cycleway is part of a road or a separate way.
-- This part relies heavly on the `is_sidepath` tagging.
local function cyclewaySeparatedCases(tags)
  -- Case "Hochbordradwege"
  -- Detailled tagging to separate this case from `footAndCyclewaySegregatedCases`
  if tags.highway == "path"
      and (tags.foot == "yes" or tags.foot == "designated")
      and (tags.bicycle == "yes" or tags.bicycle == "designated")
      and tags.segregated == "yes"
      and tags.is_sidepath == "yes"
      and not IsTermInString("241", tags.traffic_sign) then
    return "cycleway_adjoining"
  end

  -- traffic_sign=DE:237, "Radweg", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
  -- cycleway=track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dtrack
  -- cycleway=opposite_track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_track
  local taggedWithAccessTagging = tags.highway == "cycleway" and
      (tags.cycleway == "track" or tags.cycleway == "opposite_track" or tags.is_sidepath)
  -- Testcase: The "not 'lane'" part is needed for places like https://www.openstreetmap.org/way/964589554 which have the traffic sign but are not separated.
  local taggedWithTrafficsign = osm2pgsql.has_prefix(tags.traffic_sign, "DE:237") and not tags.cycleway == "lane"
  if taggedWithAccessTagging or taggedWithTrafficsign then
    if IsSidepath(tags) then
      -- This could be PBLs "Protected Bike Lanes"
      -- Eg https://www.openstreetmap.org/way/964476026
      -- Eg https://www.openstreetmap.org/way/278057274
      return "cycleway_adjoining"
    end
    if tags.is_sidepath == "no" then
      -- Case: "frei geführte Radwege", dedicated cycleways that are not next to a road
      -- Eg https://www.openstreetmap.org/way/27701956
      return "cycleway_isolated"
    end
    return "cycleway_adjoiningOrIsolated"
  end
end

-- Case: Crossing
--    Examples https://github.com/FixMyBerlin/atlas-app/issues/23
local function crossing(tags)
  if tags.highway == "cycleway" and tags.cycleway == "crossing" then
    return "crossing"
  end
  if tags.highway == "path" and tags.path == "crossing"
      and (tags.bicycle == "yes" or tags.bicycle == "designated") then
    return "crossing"
  end
  if tags.highway == "footway" and tags.footway == "crossing"
      and (tags.bicycle == "yes" or tags.bicycle == "designated") then
    return "crossing"
  end
end

-- Case: "Link", a road segment that is required to create a routable network but (most of the time) does not represent physical infrastructure)
local function cyclewayLink(tags)
  if tags.highway == "cycleway" and tags.cycleway == "link" then
    return "cyclewayLink"
  end
end

-- Case: Cycleway identified via "lane"-tagging, which means it is part of the highway.
--    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dlane
--    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_lane
local function cyclewayOnHighwayCases(tags)
  if tags.highway == 'cycleway' then
    if tags.cycleway == "lane" or tags.cycleway == "opposite_lane" then
      -- https://wiki.openstreetmap.org/wiki/Key:cycleway:lane
      if tags['lane'] == 'advisory' then
        -- DE: Schutzstreifen
        return "cyclewayOnHighway_advisory"
      end
      if tags['lane'] == 'exclusive' then
        -- DE: Radfahrstreifen
        return "cyclewayOnHighway_exclusive"
      end
      return "cyclewayOnHighway_advisoryOrExclusive"
    end
  end
end

-- Case: Cycleway identified via "shared_lane"-tagging ("Anteilig genutzten Fahrstreifen")
--    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dshared_lane
local function sharedMotorVehicleLane(tags)
  local result = tags.highway == 'cycleway' and tags.cycleway == "shared_lane"
  if result then
    return "sharedMotorVehicleLane"
  end
end

-- Case: "Radweg in Mittellage", mainly cyclways which are left of the (right) turn lane
-- https://wiki.openstreetmap.org/wiki/Forward_%26_backward,_left_%26_right
-- https://wiki.openstreetmap.org/wiki/Lanes#Crossing_with_a_designated_lane_for_bicycles
local function cyclewayOnHighwayBetweenLanes(tags)
  if tags['_parent_highway'] == nil or tags._prefix == 'sidewalk' then return end

  if IsTermInString("|lane|", tags['cycleway:lanes']) or IsTermInString("|designated|", tags['bicycle:lanes']) then
    return "cyclewayOnHighwayBetweenLanes"
  end
end

local function sharedBusLane(tags)
  if tags.highway == "cycleway" then
    if tags.cycleway == "share_busway" or tags.cycleway == "opposite_share_busway" then
      return "sharedBusLane" -- (until 2023-03-2: cyclewayAlone)
    end
  end
end

-- Explicit tagging as "Mischverkehr" without any traffic sign or road marking
-- In our style, we ignore this tagging and do not assign an explicit category.
-- The default for highways is, that they are shared unless forbidden.
-- This is an explicit category so that it is not rendered as "needsClarification"
-- Example https://www.openstreetmap.org/way/35396829/history
local function sharedLane(tags)
  if tags.cycleway == "shared" then
    return "explicitSharedLaneButNoSignage"
  end
end

-- This is where we collect bike lanes that do not have sufficient tagging to be categorized well.
-- They are in OSM, but they need to be improved, which we show in the UI.
local function needsClarification(tags)
  if tags.highway == "cycleway"
      or (tags.highway == "path" and tags.bicycle == "designated") then
    return "needsClarification"
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
function CategorizeOnlyPresent(tags)
  local categories = {
    dataNo,
    isSeparate,
    implicitOneWay,
  }
  return defineCategory(tags, categories)
end

function CategorizeBikelane(tags)
  -- The order specifies the precedence; first one with a result win.
  local categories = {
    cyclewayLink,
    crossing,
    livingStreet,
    bicycleRoad,
    sharedBusLane,
    sharedLane,
    pedestrianAreaBicycleYes,
    sharedMotorVehicleLane,
    -- Detailed tagging cases
    cyclewayOnHighwayBetweenLanes,
    footAndCyclewaySharedCases,
    footAndCyclewaySegregatedCases,
    cyclewaySeparatedCases,
    cyclewayOnHighwayCases,
    footwayBicycleYesCases, -- after `cyclewaySeparatedCases`
    -- Needs to be last
    needsClarification,
  }
  return defineCategory(tags, categories)
end
