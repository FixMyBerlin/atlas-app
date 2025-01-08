package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
package.path = package.path .. ";/processing/topics/helper/?.lua"
require("ContainsSubstring")
require("IsSidepath")
require("CreateSubcategoriesAdjoiningOrIsolated")
require("SanitizeTrafficSign")
require("DeriveSmoothness")
require("HighwayClasses")
BikelaneCategory = {}
BikelaneCategory.__index = BikelaneCategory

-- @param args table
-- @param args.desc string
-- @param args.condition function
-- @param args.insfrastructureExists boolean
-- @param args.implicitOneWay boolean
function BikelaneCategory.new(args)
  local self = setmetatable({}, BikelaneCategory)
  local fields = {'id', 'desc', 'infrastructureExists', 'implicitOneWay', 'condition'}
  for _, v in pairs(fields) do
    if args[v] == nil then
      error('Missing field "' .. v .. '" for BikelaneCategory "' .. args.id .. '"')
    end
    self[v] = args[v]
  end
  return self
end

function BikelaneCategory:__call(tags)
  return self.condition(tags)
end

local dataNo = BikelaneCategory.new({
  id = 'data_no',
  desc = 'The explicit absence of bike infrastrucute',
  infrastructureExists = false,
  implicitOneWay = false, -- explicit absence category
  condition = function(tags)
    local nos = Set({ 'no', 'none' })
    if nos[tags.cycleway] then
      return true
    end
  end
})

local isSeparate = BikelaneCategory.new({
  id = 'separate_geometry',
  desc = '',
  infrastructureExists = false,
  implicitOneWay = false, -- explicit absence category
  condition = function(tags)
    if tags.cycleway == 'separate' then
      return true
    end
  end
})

-- for oneways we assume that the tag `cycleway=*` significates that there's one bike line on the right
-- TODO: this assumes right hand traffic (would be nice to specify this as an option)
local implicitOneWay = BikelaneCategory.new({
  id = 'not_expected',
  desc = '',
  infrastructureExists = false,
  implicitOneWay = false, -- explicit absence category
  condition = function(tags)
    local result = tags._prefix == 'cycleway' and tags._infix == '' -- object is created from implicit case
    result = result and tags._parent.oneway == 'yes' and
        tags._parent['oneway:bicycle'] ~= 'no'                      -- is oneway w/o bike exception
    result = result and tags._side == "left"                        -- is the left side object
    if result then
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=pedestrian
local pedestrianAreaBicycleYes = BikelaneCategory.new({
  id = "pedestrianAreaBicycleYes",
  desc = 'Pedestrian area (DE:"Fußgängerzonen") with' ..
      ' explicit allowance for bicycles (`bicycle=yes`). `dismount` counts as `no`.' ..
      ' (We only process the ways, not the `area=yes` Polygon.)',
  infrastructureExists = true,
  implicitOneWay = false, -- road shared, both lanes
  condition = function(tags)
    if tags.highway == "pedestrian" and (tags.bicycle == "yes" or tags.bicycle == "designated") then
      return true
    end
  end
})

-- TODO DEPRECATED: Remove after 2025-01-01
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=living_street
local livingStreet = BikelaneCategory.new({
  id = 'livingStreet',
  desc = '(DEPRECATED) Living streets are considered bike friendly and added unless prohibided.' ..
      ' (DE: "Verkehrsberuhigter Bereich" AKA "Spielstraße")' ..
      ' — DEPRECATION: This was moved to bikeSuitability.bikeSuitability=livingStreet on 2024-10 and will be removed from roads 2025-01-01.',
  infrastructureExists = true,
  implicitOneWay = false, -- road shared, both lanes
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
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- traffic_sign=DE:244, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:244
local bicycleRoad = BikelaneCategory.new({
  id = 'bicycleRoad',
  desc = 'Bicycle road (DE: "Fahrradstraße")',
  infrastructureExists = true,
  implicitOneWay = false, -- road shared, both lanes
  condition = function(tags)
    if tags.bicycle_road == "yes" then
      return true
    end
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if osm2pgsql.has_prefix(trafficSign, 'DE:244') then
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- traffic_sign=DE:244,1020-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:244
local bicycleRoad_vehicleDestination = BikelaneCategory.new({
  id = 'bicycleRoad_vehicleDestination',
  desc = 'Bicycle road (DE: "Fahrradstraße mit Anlieger frei")' ..
      ' with vehicle access `destination`.',
  infrastructureExists = true,
  implicitOneWay = false, -- road shared, both lanes
  condition = function(tags)
    -- Subcategory when bicycle road allows vehicle traffic
    if bicycleRoad(tags) then
      local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
      if ContainsSubstring(trafficSign, "1020-30") then
        return true
      end
      if tags.vehicle == 'destination' or tags.motor_vehicle == 'destination' then
        return true
      end
    end
  end
})


-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:240
local footAndCyclewayShared = BikelaneCategory.new({
  id = 'footAndCyclewayShared',
  desc = 'Shared bike and foot path (DE: "Gemeinsamer Geh- und Radweg")',
  infrastructureExists = true,
  implicitOneWay = true, -- "shared lane"-like
  condition = function(tags)
    -- isolated: Eg https://www.openstreetmap.org/way/440072364 highway=service
    if tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "no" then
      return true
    end
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if osm2pgsql.has_prefix(trafficSign, "DE:240") then
      return true
    end
  end
})
local footAndCycleway_adjoining, footAndCyclewayShared_isolated, footAndCyclewayShared_adjoiningOrIsolated = CreateSubcategoriesAdjoiningOrIsolated(footAndCyclewayShared)

-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:241-31
local footAndCyclewaySegregated = BikelaneCategory.new({
  id = 'footAndCyclewaySegregated',
  desc = 'Shared bike and foot path (DE: "Getrennter Geh- und Radweg", "Getrennter Rad- und Gehweg")',
  infrastructureExists = true,
  implicitOneWay = true, -- "shared lane"-like
  condition = function(tags)
    if tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "yes" then
      return true
    end
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if osm2pgsql.has_prefix(trafficSign, "DE:241") then
        return true
    end

    -- Edge case: https://www.openstreetmap.org/way/1319011143#map=18/52.512226/13.288552
    -- No traffic_sign but mapper decided to map foot- and bike lane as separate geometry
    -- We check for traffic_mode:right=foot
    -- But in some cases, it is OK to map traffic_mode:right=foot but there is a separation.
    -- Those cases are not `footAndCyclewaySegregated`. So if a separation is given, this has to be "no".
    -- Eg. https://www.openstreetmap.org/way/244549219
    local separation_right = tags['separation:right'] or tags['separation:both'] or tags['separation']
    local separation_condition = true
    if(separation_right ~= nil) then separation_condition = separation_right == "no" end
    local traffic_mode_right = tags['traffic_mode:right'] or tags['traffic_mode:both'] or tags['traffic_mode']
    if tags.highway == "cycleway" and traffic_mode_right == "foot" and separation_condition then
      return true
    end
  end
})
local footAndCyclewaySegregated_adjoining, footAndCyclewaySegregated_isolated, footAndCyclewaySegregated_adjoiningOrIsolated = CreateSubcategoriesAdjoiningOrIsolated(footAndCyclewaySegregated)

-- Case: "Gehweg, Fahrrad frei"
-- traffic_sign=DE:1022-10 "Fahrrad frei", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign=DE:239
local footwayBicycleYes = BikelaneCategory.new({
  id = 'footwayBicycleYes',
  desc = 'Footway / Sidewalk with explicit allowance for bicycles (`bicycle=yes`)' ..
      ' (DE: "Gehweg, Fahrrad frei")',
  infrastructureExists = true,
  implicitOneWay = true, -- "shared lane"-like
  condition = function(tags)
    -- mtb:scale=* is a strong indicator for path' that we do not want to show, so we skip them;
    --    This will likely need a better solution in the future.
    --    Eg https://www.openstreetmap.org/way/23366687
    if tags["mtb:scale"] then return end

    if tags.highway == "footway" or tags.highway == "path" then
      if tags.bicycle == "yes" then
        return true
      end
      local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
      if ContainsSubstring(trafficSign, "1022-10") then
        return true
      end
    end
  end
})
local footwayBicycleYes_adjoining, footwayBicycleYes_isolated, footwayBicycleYes_adjoiningOrIsolated = CreateSubcategoriesAdjoiningOrIsolated(footwayBicycleYes)

-- Handle different cases for separated bikelanes ("baulich abgesetzte Radwege")
-- The sub-tagging specifies if the cycleway is part of a road or a separate way.
-- This part relies heavly on the `is_sidepath` tagging.
local cyclewaySeparated = BikelaneCategory.new({
  id = 'cycleway',
  desc = '', -- TODO desc
  infrastructureExists = true,
  implicitOneWay = false,  -- "track"-like and `oneway=yes` (common in cities) is usually explicit
  condition = function(tags)
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)

    -- Case "Hochbordradwege"
    -- Detailled tagging to separate this case from `footAndCyclewaySegregatedCases`
    if tags.highway == "path"
        and (tags.foot == "yes" or tags.foot == "designated")
        and (tags.bicycle == "yes" or tags.bicycle == "designated")
        and tags.segregated == "yes"
        and tags.is_sidepath == "yes"
        and not ContainsSubstring(trafficSign, "241") then
      return true
    end

    -- traffic_sign=DE:237, "Radweg", https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
    -- cycleway=track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=track
    -- cycleway=opposite_track, https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_track
    if tags.highway == "cycleway" and (tags.cycleway == "track" or tags.cycleway == "opposite_track" or tags.is_sidepath) then
      return true
    end
    -- Testcase: The "not 'lane'" part is needed for places like https://www.openstreetmap.org/way/964589554 which have the traffic sign but are not separated.
    -- adjoining:
    -- This could be PBLs "Protected Bike Lanes"
    -- Eg https://www.openstreetmap.org/way/964476026
    -- Eg https://www.openstreetmap.org/way/278057274
    -- isolated:
    -- Case: "frei geführte Radwege", dedicated cycleways that are not next to a road
    -- Eg https://www.openstreetmap.org/way/27701956
    if osm2pgsql.has_prefix(trafficSign, "DE:237") and not tags.cycleway == "lane" then
      return true
    end
  end
})
local cyclewaySeparated_adjoining, cyclewaySeparated_isolated, cyclewaySeparated_adjoiningOrIsolated = CreateSubcategoriesAdjoiningOrIsolated(cyclewaySeparated)

-- Examples https://github.com/FixMyBerlin/atlas-app/issues/23
local crossing = BikelaneCategory.new({
  id = 'crossing',
  desc = 'Crossings with relevance for bicycles.' ..
      ' There is no split into more specific infrastrucute categories for now.',
  infrastructureExists = true,
  implicitOneWay = false, -- really unknown, but `oneway=yes` (common in cities) is usually explicit
  condition = function(tags)
    if tags.highway == "cycleway" and tags.cycleway == "crossing" then
      return true
    end
    if tags.highway == "path" and tags.path == "crossing"
        and (tags.bicycle == "yes" or tags.bicycle == "designated") then
      return true
    end
    if tags.highway == "footway" and tags.footway == "crossing"
        and (tags.bicycle == "yes" or tags.bicycle == "designated") then
      return true
    end
  end
})

local cyclewayLink = BikelaneCategory.new({
  id = 'cyclewayLink',
  desc = 'A non-infrastrucute category.' ..
      ' `cycleway=link` is used to connect the road network for routing use cases' ..
      ' when no physical infrastructure is present.',
  infrastructureExists = true,
  implicitOneWay = false, -- really unknown, but `oneway=yes` (common in cities) is usually explicit
  condition = function(tags)
    if tags.highway == "cycleway" and tags.cycleway == "link" then
      return true
    end
  end
})


-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=lane
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_lane
-- https://wiki.openstreetmap.org/wiki/Key:cycleway:lane
local cyclewayOnHighway_advisoryOrExclusive = BikelaneCategory.new({
  id = 'cyclewayOnHighway_advisoryOrExclusive',
  desc = 'Bicycle infrastrucute on the highway, right next to motor vehicle traffic.' ..
      ' This category is split into subcategories for "advisory" (DE: "Schutzstreifen")' ..
      ' and "exclusive" lanes (DE: "Radfahrstreifen").',
  infrastructureExists = true,
  implicitOneWay = true, -- "lane"-like
  condition = function(tags)
    if tags.highway == 'cycleway' then
      if tags._side ~= 'self' then
        -- "Angstweichen" are a special case where the cycleway is part of the road which is tagged using one of their `*:lanes` schema.
        -- Those get usually dual tagged as `cycleway:right=lane` to make the "Angstweiche" "visible" to routing.
        -- For this category, we skip the dual tagging but still want to capture cases where there is an actual `lane` ("Schutzstreifen") as well as a "Angstweiche".
        -- The actual double infra is present when the lanes have both "|lane|" (the "Angstweiche") as well a a suffix "|lane" (the "Schutzstreifen").
        -- Note: `tags.lanes` is `cycleway:lanes` but unnested whereas `bicycle:lanes` does not get unnested.
        if ContainsSubstring(tags.lanes,'|lane|') then
          if not osm2pgsql.has_suffix(tags.lanes, '|lane') then
            return false
          end
        end
        if ContainsSubstring(tags._parent['bicycle:lanes'], '|designated|') then
          if not osm2pgsql.has_suffix(tags._parent['bicycle:lanes'], '|designated') then
            return false
          end
        end
      end
      if tags.cycleway == "lane" or tags.cycleway == "opposite_lane" then
        return true
      end
    end
  end
})


-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=lane
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_lane
-- https://wiki.openstreetmap.org/wiki/Key:cycleway:lane
local cyclewayOnHighway_advisory = BikelaneCategory.new({
  id = 'cyclewayOnHighway_advisory',
  desc = 'Bicycle infrastructure on the highway, right next to motor vehicle traffic.' ..
      'For "advisory" lanes (DE: "Schutzstreifen")',
  infrastructureExists = true,
  implicitOneWay = true, -- "lane"-like
  condition = function(tags)
    if cyclewayOnHighway_advisoryOrExclusive(tags) then
      if tags['lane'] == 'advisory' then
        return true -- DE: Schutzstreifen
      end
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=lane
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=opposite_lane
-- https://wiki.openstreetmap.org/wiki/Key:cycleway:lane
local cyclewayOnHighway_exclusive = BikelaneCategory.new({
  id = 'cyclewayOnHighway_exclusive',
  desc = 'Bicycle infrastrucute on the highway, right next to motor vehicle traffic.' ..
      ' For "exclusive" lanes (DE: "Radfahrstreifen").',
  infrastructureExists = true,
  implicitOneWay = true, -- "lane"-like
  condition = function(tags)
    if cyclewayOnHighway_advisoryOrExclusive(tags) then
      if tags['lane'] == 'exclusive' then
        return true -- DE: Radfahrstreifen
      end
    end
  end
})

-- Case: Cycleway identified via "shared_lane"-tagging ("Anteilig genutzten Fahrstreifen")
-- https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway=shared_lane
local sharedMotorVehicleLane = BikelaneCategory.new({
  id = 'sharedMotorVehicleLane',
  desc = '', -- TODO desc; Wiki nochmal nachlesen und Conditions prüfen
  infrastructureExists = true,
  implicitOneWay = false, -- (both) road shared, both lanes, (left|right would be `implicit_yes`)
  condition = function(tags)
    if tags.highway == 'cycleway' and tags.cycleway == "shared_lane" then
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/Forward_&_backward,_left_&_right
-- https://wiki.openstreetmap.org/wiki/Lanes#Crossing_with_a_designated_lane_for_bicycles
local cyclewayOnHighwayBetweenLanes = BikelaneCategory.new({
  id = 'cyclewayOnHighwayBetweenLanes',
  desc = 'Bike lane between motor vehicle lanes,' ..
      ' mostly on the left of a right turn lane. (DE: "Radweg in Mittellage")',
  infrastructureExists = true,
  implicitOneWay = true, -- "lane"-like
  condition = function(tags)
    if tags._side == 'self' then
      if ContainsSubstring(tags['cycleway:lanes'], "|lane|") then
        return true
      end
      if ContainsSubstring(tags['bicycle:lanes'], "|designated|") then
        return true
      end
    end
  end
})

-- TODO: maybe rename to cyclewayOnHighwayProtected ?
local protectedCyclewayOnHighway = BikelaneCategory.new({
  id = 'protectedCyclewayOnHighway',
  desc = 'Protected bikelanes e.g. bikelanes with physical separation from motorized traffic.',
  infrastructureExists = true,
  implicitOneWay = true, -- "lane"-like
  condition = function(tags)
    -- Only include center line tagged cycleways
    if tags._prefix == nil then
      return false
    end

    -- We don't use our `Set` pattern here because we need a Substring check
    local function isPhysicalSeperation(separation)
      local physicalSeparations = {
        'bollard',
        'parking_lane',
        'bump',
        'separation_kerb',
        'vertical_panel',
        'fence',
        'flex_post',
        'jersey_barrier',
        'kerb'
      }
      for _, value in pairs(physicalSeparations) do
        if ContainsSubstring(separation, value) then
          return true
        end
      end
    end

    -- We go from specific to general tags (:side > :both > '')
    local separation_left = tags['separation:left'] or tags['separation:both'] or tags['separation']
    local separation_right = tags['separation:right'] or tags['separation:both'] or tags['separation']

    if not isPhysicalSeperation(separation_left) then
      return false
    end

    -- Check also the left separation for the rare case that there is motorized traffic on the right hand side
    local traffic_mode_right = tags['traffic_mode:right'] or tags['traffic_mode:both'] or tags['traffic_mode']
    if traffic_mode_right == 'motorized' then
      if not isPhysicalSeperation(separation_right) then
        return false
      end
    end

    return true
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
  -- Note: Was `sharedBusLane` until 2024-05-02 when we introduced `sharedBusLaneBikeWithBus`
  id = 'sharedBusLaneBusWithBike',
  desc = 'Bus lane with explicit allowance for bicycles (`cycleway=share_busway`).' ..
      ' (DE: "Bussonderfahrstreifen mit Fahrrad frei")',
  infrastructureExists = true,
  implicitOneWay = true, -- "shared lane"-like
  condition = function(tags)
    if tags.highway == "cycleway" and
        (tags.cycleway == "share_busway" or tags.cycleway == "opposite_share_busway") then
      return true
    end
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if osm2pgsql.has_prefix(trafficSign, "DE:245") and
        (ContainsSubstring(trafficSign, "1022-10") or ContainsSubstring(trafficSign, "1022-14")) then
      return true
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
  id = 'sharedBusLaneBikeWithBus',
  desc = 'Bicycle lane with explicit allowance for buses.' ..
      ' (DE: "Radfahrstreifen mit Freigabe Busverkehr")',
  infrastructureExists = true,
  implicitOneWay = true, -- "shared lane"-like
  condition = function(tags)
    if tags.highway == "cycleway" and tags.lane == "share_busway" then
      return true
    end
    local trafficSign = SanitizeTrafficSign(tags.traffic_sign)
    if osm2pgsql.has_prefix(trafficSign, "DE:237") and ContainsSubstring(trafficSign, "1024-14") then
      return true
    end
  end
})

-- This is where we collect bike lanes that do not have sufficient tagging to be categorized well.
-- They are in OSM, but they need to be improved, which we show in the UI.
-- GOTCHA:
-- This category will also collect all transformed geometries that had any `cycleway:*` tag.
-- This can include false translformations like when someone tagged `cycleway:separation:right=foo` which will create a transformed object
-- (which we "see" as an `highway=cycleway`) for both sides (based on `cycleway:NIL` being recognized as `cycleway:both`).
local needsClarification = BikelaneCategory.new({
  id = 'needsClarification',
  desc = 'Bike infrastructure that we cannot categories properly due to missing or ambiguous tagging.' ..
      ' Check the `todos` property on hints on how to improve the tagging.',
  infrastructureExists = true,
  implicitOneWay = false, -- really unknown, but `oneway=yes` (common in cities) is usually explicit
  condition = function(tags)
    -- hack: because `cyclewayBetweenLanes` is now detected on the `self` object we need to filter out the right side here
    -- to fix this we would need to double classify objects
    if tags._side == 'right' then
      if (ContainsSubstring(tags['cycleway:lanes'], "|lane|") or
        ContainsSubstring(tags['bicycle:lanes'], "|designated|")) then
        return false
      end
    end

    if tags.cycleway == "shared" then
      return true
    end

    if tags.highway == "cycleway"
        or (tags.highway == "path" and tags.bicycle == "designated") then
      return true
    end

    if tags.highway == 'footway' and tags.bicycle == 'designated' then
      return true
    end
  end
})

-- The order specifies the precedence; first one with a result win.
local categoryDefinitions = {
  dataNo,
  isSeparate,
  implicitOneWay,
  protectedCyclewayOnHighway,
  cyclewayLink,
  crossing,
  livingStreet,
  bicycleRoad_vehicleDestination,
  bicycleRoad, -- has to come after `bicycleRoad_vehicleDestination`
  sharedBusLaneBikeWithBus,
  sharedBusLaneBusWithBike,
  pedestrianAreaBicycleYes,
  sharedMotorVehicleLane,
  -- Detailed tagging cases
  cyclewayOnHighwayBetweenLanes,
  footAndCycleway_adjoining,
  footAndCyclewayShared_isolated,
  footAndCyclewayShared_adjoiningOrIsolated,
  footAndCyclewaySegregated_adjoining,
  footAndCyclewaySegregated_isolated,
  footAndCyclewaySegregated_adjoiningOrIsolated,
  cyclewaySeparated_adjoining,
  cyclewaySeparated_isolated,
  cyclewaySeparated_adjoiningOrIsolated,
  cyclewayOnHighway_advisory,
  cyclewayOnHighway_exclusive,
  cyclewayOnHighway_advisoryOrExclusive,
  footwayBicycleYes_adjoining, -- after `cyclewaySeparated_*`
  footwayBicycleYes_isolated,
  footwayBicycleYes_adjoiningOrIsolated,
  -- Needs to be last
  needsClarification
}

function CategorizeBikelane(tags)
  for _, category in pairs(categoryDefinitions) do
    if category(tags) then
      return category
    end
  end
  return nil
end
