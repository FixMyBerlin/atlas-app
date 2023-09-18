package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("CopyTags")

function RoadClassification(object)
  -- Values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)

  local roadClassification = {}
  local tags = object.tags

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- We use the OSM highway value as category, but have a few special cases below.
  local highway_mapping = {
    road = "unspecified_road",
    steps = "footway_steps",
  }
  roadClassification.road = highway_mapping[tags.highway] or tags.highway

  -- Sidewalks
  if (tags.highway == 'footway' and tags.footway == 'sidewalk')
      or (tags.highway == 'path' and tags.is_sidepath == 'yes') then
    roadClassification.road = "footway_sidewalk"
  end

  -- Sidewalks Crossing
  if tags.highway == 'footway' and tags.footway == 'crossing' then
    roadClassification.road = "footway_crossing"
  end

  -- Bikelane Crossing
  if tags.highway == 'cycleway' and tags.cycleway == 'crossing' then
    roadClassification.road = "cycleway_crossing"
  end

  -- Vorfahrtsstraße, Zubringerstraße
  -- https://wiki.openstreetmap.org/wiki/DE:Key:priority_road
  if (tags.highway == 'residential' and tags.priority_road == 'designated')
      or (tags.highway == 'residential' and tags.priority_road == 'yes_unposted') then
    roadClassification.road = "residential_priority_road"
  end

  -- Service
  -- https://wiki.openstreetmap.org/wiki/DE:Key:service
  if tags.highway == "service" then
    local service_mapping = {
      alley = 'service_alley',
      driveway = 'service_driveway',
      parking_isle = 'service_parking_aisle'
    }
    -- Fallback:
    roadClassification.road = service_mapping[tags.service] or 'service_uncategorized'
    -- https://taginfo.openstreetmap.org/keys/service#values
    if tags.service == nil then
      tags.category = "service_road"
    end
  end

  -- Fahrradstraßen
  if tags.bicycle_road == 'yes' then
    -- traffic_sign=DE:244.1
    roadClassification.road = "bicycle_road"
  end

  -- Mischverkehr
  -- INFO: Deactivated for now. Not needed during styling and buggy ATM.
  -- if tags.bicycle ~= 'no' and tags.bicycle ~= 'use_sidepath' then
  --   if MinorRoadClasses[tags.highway] or MajorRoadClasses[tags.highway] then
  --     roadClassification.road_implicit_shared_lane = true
  --   end
  -- end

  if tags.oneway == 'yes' or tags.oneway == 'no' then
    roadClassification.road_oneway = tags.oneway
    if tags.oneway == 'yes' and tags.dual_carriageway == "yes" then
      roadClassification.road_oneway = tags.oneway .. '_dual_carriageway'
    end
  end
  if tags['oneway:bicycle'] == 'no' or tags['oneway:bicycle'] then
    roadClassification['road_oneway:bicycle'] = tags['oneway:bicycle']
  end

  local tags_cc = {
    "name",
    "highway",
    "footway",
    "access",
    "service",
    "is_sidepath",
    "maxspeed",
    "surface",
    "smoothness",
    "oneway",
    "oneway:bicycle",
  }
  CopyTags(tags, roadClassification, tags_cc, "osm_")

  return roadClassification
end
