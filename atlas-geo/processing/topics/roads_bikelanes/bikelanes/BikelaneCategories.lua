package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
package.path = package.path .. ";/processing/topics/helper/?.lua"
require("IsTermInString")
require("IsSidepath")
require("AddAdjoiningOrIsolated")
require("SanitizeTrafficSign")
BikelaneCategory = {}
BikelaneCategory.__index = BikelaneCategory

-- @param args table
-- @param args.desc string
-- @param args.condition function
function BikelaneCategory.new(args)
  local self = setmetatable({}, BikelaneCategory)
  self.desc = args.desc
  self.condition = args.condition
  return self
end

function BikelaneCategory:checkCondition(tags)
  return self.condition(tags)
end

local dataNo = BikelaneCategory.new({
  desc = 'The explicit absence of bike infrastrucute',
  condition = function(tags)
    local nos = Set({ 'no', 'none' })
    if nos[tags.cycleway] then
      return "data_no"
    end
  end
})

local isSeparate = BikelaneCategory.new({
  desc = '',
  condition = function(tags)
    if tags.cycleway == 'separate' then
      return 'separate_geometry'
    end
  end
})

-- for oneways we assume that the tag `cycleway=*` significates that there's one bike line on the right
-- TODO: this assumes right hand traffic (would be nice to specify this as an option)
local implicitOneWay = BikelaneCategory.new({
  desc = '',
  condition = function(tags)
    local result = tags._prefix == 'cycleway' and tags._infix == '' -- object is created from implicit case
    result = result and tags._parent.oneway == 'yes' and
        tags._parent['oneway:bicycle'] ~= 'no'                      -- is oneway w/o bike exception
    result = result and tags._side == "left"                        -- is the left side object
    if result then
      return 'not_expected'
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=pedestrian
local pedestrianAreaBicycleYes = BikelaneCategory.new({
  desc = 'Pedestrian area (DE:"Fußgängerzonen") with' ..
      ' explicit allowance for bicycles (`bicycle=yes`). `dismount` counts as `no`.' ..
      ' (We only process the ways, not the `area=yes` Polygon.)',
  condition = function(tags)
    if tags.highway == "pedestrian" and (tags.bicycle == "yes" or tags.bicycle == "designated") then
      return "pedestrianAreaBicycleYes"
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=living_street
local livingStreet = BikelaneCategory.new({
  desc = 'Living streets are considered bike friendly and added unless prohibided.' ..
      ' (DE: "Verkehrsberuhigter Bereich" AKA "Spielstraße")',
  condition = function(tags)
    if tags.highway == "living_street" then
      -- Exit if all vehicle are prohibited (but don't exit if bikes are allowed)
      if tags.vehicle == "no" and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
        return nil
      end
      -- Exit if bikes are prohibited
      if tags.bicycle == "no" or tags.bicycle == "dismount" then
        return nil
      end
      return "livingStreet"
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- traffic_sign=DE:244, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:244
local bicycleRoadCases = BikelaneCategory.new({
  desc = 'Bicycle road (DE: "Fahrradstraße")' ..
      ' with subcategory for vehicle access `destination`.',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if tags.bicycle_road == "yes"
        or osm2pgsql.has_prefix(trafficSign, 'DE:244')
    then
      -- Subcategory when bicycle road allows vehicle traffic
      if trafficSign == 'DE:244.1,1020-30'
          or trafficSign == 'DE:244,1020-30'
          or tags.vehicle == 'destination'
          or tags.motor_vehicle == 'destination' then
        return "bicycleRoad_vehicleDestination"
      end

      return "bicycleRoad"
    end
  end
})

-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:240
local footAndCyclewaySharedCases = BikelaneCategory.new({
  desc = 'Shared bike and foot path (DE: "Gemeinsamer Geh- und Radweg")' ..
      ' with subcategories for adjoining or isolated paths.',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    local taggedWithAccessTagging = tags.bicycle == "designated" and tags.foot == "designated" and
        tags.segregated == "no"
    local taggedWithTrafficsign = osm2pgsql.has_prefix(trafficSign, "DE:240")
    if taggedWithAccessTagging or taggedWithTrafficsign then
      -- isolated:
      -- Eg https://www.openstreetmap.org/way/440072364 highway=service
      return AddAdjoiningOrIsolated("footAndCyclewayShared", tags)
    end
  end
})

-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:241-31
local footAndCyclewaySegregatedCases = BikelaneCategory.new({
  desc = 'Shared bike and foot path (DE: "Getrennter Geh- und Radweg", "Getrennter Rad- und Gehweg")' ..
      ' with subcategories for adjoining or isolated paths.',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    local taggedWithAccessTagging = tags.bicycle == "designated" and tags.foot == "designated" and
        tags.segregated == "yes"
    local taggedWithTrafficsign = osm2pgsql.has_prefix(trafficSign, "DE:241")
    if taggedWithAccessTagging or taggedWithTrafficsign then
      return AddAdjoiningOrIsolated("footAndCyclewaySegregated", tags)
    end
  end
})

-- Case: "Gehweg, Fahrrad frei"
-- traffic_sign=DE:1022-10 "Fahrrad frei", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:239
local footwayBicycleYesCases = BikelaneCategory.new({
  desc = 'Footway / Sidewalk with explicit allowance for bicycles (`bicycle=yes`)' ..
      ' (DE: "Gehweg, Fahrrad frei")' ..
      ' and subcategories for adjoining or isolated paths.',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)

    -- mtb:scale=* is a strong indicator for path' that we do not want to show, so we skip them;
    --    This will likely need a better solution in the future.
    --    Eg https://www.openstreetmap.org/way/23366687
    if tags["mtb:scale"] then return end

    if tags.highway == "footway" or tags.highway == "path" then
      local taggedWithAccessTagging = tags.bicycle == "yes"
      local taggedWithTrafficsign = IsTermInString("1022-10", trafficSign)
      if taggedWithAccessTagging or taggedWithTrafficsign then
        return AddAdjoiningOrIsolated("footwayBicycleYes", tags)
      end
    end
  end
})

-- Handle different cases for separated bikelanes ("baulich abgesetzte Radwege")
-- The sub-tagging specifies if the cycleway is part of a road or a separate way.
-- This part relies heavly on the `is_sidepath` tagging.
local cyclewaySeparatedCases = BikelaneCategory.new({
  desc = '', -- TODO desc
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)

    -- Case "Hochbordradwege"
    -- Detailled tagging to separate this case from `footAndCyclewaySegregatedCases`
    if tags.highway == "path"
        and (tags.foot == "yes" or tags.foot == "designated")
        and (tags.bicycle == "yes" or tags.bicycle == "designated")
        and tags.segregated == "yes"
        and tags.is_sidepath == "yes"
        and not IsTermInString("241", trafficSign) then
      return "cycleway_adjoining"
    end

    -- traffic_sign=DE:237, "Radweg", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
    -- cycleway=track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=track
    -- cycleway=opposite_track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_track
    local taggedWithAccessTagging = tags.highway == "cycleway" and
        (tags.cycleway == "track" or tags.cycleway == "opposite_track" or tags.is_sidepath)
    -- Testcase: The "not 'lane'" part is needed for places like https://www.openstreetmap.org/way/964589554 which have the traffic sign but are not separated.
    local taggedWithTrafficsign = osm2pgsql.has_prefix(trafficSign, "DE:237") and not tags.cycleway == "lane"
    if taggedWithAccessTagging or taggedWithTrafficsign then
      -- adjoining:
      -- This could be PBLs "Protected Bike Lanes"
      -- Eg https://www.openstreetmap.org/way/964476026
      -- Eg https://www.openstreetmap.org/way/278057274
      -- isolated:
      -- Case: "frei geführte Radwege", dedicated cycleways that are not next to a road
      -- Eg https://www.openstreetmap.org/way/27701956
      return AddAdjoiningOrIsolated("cycleway", tags)
    end
  end
})

-- Examples https://github.com/FixMyBerlin/atlas-app/issues/23
local crossing = BikelaneCategory.new({
  desc = 'Crossings with relevance for bicycles.' ..
      ' There is no split into more specific infrastrucute categories for now.',
  condition = function(tags)
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
})

local cyclewayLink = BikelaneCategory.new({
  desc = 'A non-infrastrucute category.' ..
      ' `cycleway=link` is used to connect the road network for routing use cases' ..
      ' when no physical infrastructure is present.',
  condition = function(tags)
    if tags.highway == "cycleway" and tags.cycleway == "link" then
      return "cyclewayLink"
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=lane
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_lane
-- https://wiki.openstreetmap.org/wiki/Key:cycleway:lane
local cyclewayOnHighwayCases = BikelaneCategory.new({
  desc = 'Bicycle infrastrucute on the highway, right next to motor vehicle traffic.' ..
      ' This category is split into subcategories for "advisory" (DE: "Schutzstreifen")' ..
      ' and "exclusive" lanes (DE: "Radfahrstreifen").',
  condition = function(tags)
    if tags.highway == 'cycleway' then
      if tags.cycleway == "lane" or tags.cycleway == "opposite_lane" then
        if tags['lane'] == 'advisory' then
          return "cyclewayOnHighway_advisory" -- DE: Schutzstreifen
        end
        if tags['lane'] == 'exclusive' then
          return "cyclewayOnHighway_exclusive" -- DE: Radfahrstreifen
        end
        return "cyclewayOnHighway_advisoryOrExclusive"
      end
    end
  end
})

-- Case: Cycleway identified via "shared_lane"-tagging ("Anteilig genutzten Fahrstreifen")
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=shared_lane
local sharedMotorVehicleLane = BikelaneCategory.new({
  desc = '', -- TODO desc; Wiki nochmal nachlesen und Conditions prüfen
  condition = function(tags)
    local result = tags.highway == 'cycleway' and tags.cycleway == "shared_lane"
    if result then
      return "sharedMotorVehicleLane"
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/Forward_&_backward,_left_&_right
-- https://wiki.openstreetmap.org/wiki/Lanes#Crossing_with_a_designated_lane_for_bicycles
local cyclewayOnHighwayBetweenLanes = BikelaneCategory.new({
  desc = 'Bike lane between motor vehicle lanes,' ..
      ' mostly on the left of a right turn lane. (DE: "Radweg in Mittellage")',
  condition = function(tags)
    if tags['_parent_highway'] == nil or tags._prefix == 'sidewalk' then return end

    if IsTermInString("|lane|", tags['cycleway:lanes']) or
        IsTermInString("|designated|", tags['bicycle:lanes'])
    then
      return "cyclewayOnHighwayBetweenLanes"
    end
  end
})

-- Wiki https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=share_busway
-- "Fahrrad frei" traffic_sign=DE:245,1022-10
--   - https://trafficsigns.osm-verkehrswende.org/?signs=DE%3A245%7CDE%3A1022-10
-- "Fahrrad frei, Taxi frei" traffic_sign=DE:245,1022-10,1026-30
--   - https://trafficsigns.osm-verkehrswende.org/?signs=DE%3A245%7CDE%3A1022-10%7CDE%3A1026-30
-- "Fahrrad & Mofa frei" traffic_sign=DE:245,1022-14
-- (History: Until 2023-03-2: cyclewayAlone)
local sharedBusLaneBusWithBike = BikelaneCategory.new({
  desc = 'Bus lane with explicit allowance for bicycles (`cycleway=share_busway`).' ..
      ' (DE: "Bussonderfahrstreifen mit Fahrrad frei")',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    local taggedWithAccessTagging = tags.highway == "cycleway" and
        (tags.cycleway == "share_busway" or tags.cycleway == "opposite_share_busway")
    local taggedWithTrafficsign = osm2pgsql.has_prefix(trafficSign, "DE:245") and
        (IsTermInString("1022-10", trafficSign) or IsTermInString("1022-14", trafficSign))
    if taggedWithAccessTagging or taggedWithTrafficsign then
      -- Note: Was `sharedBusLane` until 2024-05-02 when we introduced `sharedBusLaneBikeWithBus`
      return "sharedBusLaneBusWithBike"
    end
  end
})

-- Traffic sign traffic_sign=DE:237,1024-14
--   - https://trafficsigns.osm-verkehrswende.org/?signs=DE%3A237%7CDE%3A1024-14
-- OSM Verkehrswende Recommended Tagging is too complex for now, we mainly look at the traffic_sign
-- and the few uses of `cycleway:right:lane=share_busway`.
--   - 81 in DE https://taginfo.geofabrik.de/europe:germany/tags/cycleway%3Aright%3Alane=share_busway#overview
--   - 87 overall https://taginfo.openstreetmap.org/tags/cycleway%3Aright%3Alane=share_busway#overview
--   - 1 overall for left https://taginfo.openstreetmap.org/tags/cycleway%3Aleft%3Alane=share_busway#overview
local sharedBusLaneBikeWithBus = BikelaneCategory.new({
  desc = 'Bicycle lane with explicit allowance for buses.' ..
      ' (DE: "Radfahrstreifen mit Freigabe Busverkehr")',
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    local taggedWithAccessTagging = tags.highway == "cycleway" and tags.lane == "share_busway"
    local taggedWithTrafficsign =
        osm2pgsql.has_prefix(trafficSign, "DE:237") and IsTermInString("1024-14", trafficSign)
    if taggedWithAccessTagging or taggedWithTrafficsign then
      return "sharedBusLaneBikeWithBus"
    end
  end
})

-- Explicit tagging as "Mischverkehr" without any traffic sign or road marking
-- In our style, we ignore this tagging and do not assign an explicit category.
-- The default for highways is, that they are shared unless forbidden.
-- This is an explicit category so that it is not rendered as "needsClarification"
-- Example https://www.openstreetmap.org/way/35396829/history
--
-- TODO: Remove this category and make it an exit conditino to "needsClarification"
local sharedLane = BikelaneCategory.new({
  desc = '',
  condition = function(tags)
    if tags.cycleway == "shared" then
      return "explicitSharedLaneButNoSignage"
    end
  end
})

-- This is where we collect bike lanes that do not have sufficient tagging to be categorized well.
-- They are in OSM, but they need to be improved, which we show in the UI.
local needsClarification = BikelaneCategory.new({
  desc = 'Bike infrastructure that we cannot categories properly due to missing or ambiguous tagging.' ..
      ' Check the `todos` property on hints on how to improve the tagging.',
  condition = function(tags)
    if tags.highway == "cycleway"
        or (tags.highway == "path" and tags.bicycle == "designated") then
      return "needsClarification"
    end
  end
})

local function defineCategory(tags, categoryDefinitions)
  for _, categoryDefinition in pairs(categoryDefinitions) do
    local category = categoryDefinition:checkCondition(tags)
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
  local categoryDefinitions = {
    cyclewayLink,
    crossing,
    livingStreet,
    bicycleRoadCases,
    sharedBusLaneBikeWithBus,
    sharedBusLaneBusWithBike,
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
  return defineCategory(tags, categoryDefinitions)
end
