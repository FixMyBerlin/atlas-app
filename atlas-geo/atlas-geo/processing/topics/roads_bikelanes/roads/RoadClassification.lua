package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Set")
require("CopyTags")
require("Sanitize")

local tags_copied = {
  "mapillary",
  "description",
}
local tags_prefixed = {
  'traffic_sign',
  'traffic_sign:forward',
  'traffic_sign:backward',
}


function RoadClassification(object)
  local tags = object.tags
  local result_tags = {}

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- In general, we use the OSM highway value as category, but have a few special cases below.
  local highway_mapping = {
    road = "unspecified_road",
    steps = "footway_steps",
  }
  result_tags.road = highway_mapping[tags.highway] or tags.highway

  -- Sidewalks
  if (tags.highway == 'footway' and tags.footway == 'sidewalk')
      or (tags.highway == 'path' and (tags.is_sidepath == 'yes' or tags.path == 'sidewalk')) then
    result_tags.road = "footway_sidewalk"
  end

  -- Sidewalks Crossing
  if tags.highway == 'footway' and tags.footway == 'crossing' then
    result_tags.road = "footway_crossing"
  end

  -- Bikelane Crossing
  if tags.highway == 'cycleway' and tags.cycleway == 'crossing' then
    result_tags.road = "cycleway_crossing"
  end

  -- Foot- and Bicycle Crossing
  -- This is a strong simplification because we do not look at the access tags here.
  -- However, that should bring us pretty close without the added complexity.
  if tags.highway == 'path' and tags.path == 'crossing' then
    result_tags.road = "footway_cycleway_crossing"
  end

  -- Vorfahrtsstraße, Zubringerstraße
  -- https://wiki.openstreetmap.org/wiki/DE:Key:priority_road
  if tags.highway == 'residential' and
      (tags.priority_road == 'designated' or tags.priority_road == 'yes_unposted') then
    result_tags.road = "residential_priority_road"
  end

  -- Service
  -- https://wiki.openstreetmap.org/wiki/DE:Key:service
  if tags.highway == "service" then
    local service_mapping = {
      alley = 'service_alley',
      driveway = 'service_driveway',
      parking_isle = 'service_parking_aisle'
    }
    -- Fallbacks:
    result_tags.road = service_mapping[tags.service] or 'service_uncategorized'
    -- https://taginfo.openstreetmap.org/keys/service#values
    if tags.service == nil then
      result_tags.road = "service_road"
    end
  end

  -- Fahrradstraßen
  if tags.bicycle_road == 'yes' then
    -- traffic_sign=DE:244.1
    result_tags.road = "bicycle_road"
  end

  -- Mischverkehr
  -- INFO: Deactivated for now. Not needed during styling and buggy ATM.
  -- if tags.bicycle ~= 'no' and tags.bicycle ~= 'use_sidepath' then
  --   if MinorRoadClasses[tags.highway] or MajorRoadClasses[tags.highway] then
  --     roadClassification.road_implicit_shared_lane = true
  --   end
  -- end

  if tags.oneway == 'yes' then
    -- Note: We do not pass 'oneway=no' to the 'road_oneway' key
    -- because it is the default which we do not want to show in the UI.
    result_tags.road_oneway = tags.oneway
    if tags.dual_carriageway == "yes" then
      result_tags.road_oneway = tags.oneway .. '_dual_carriageway'
    end
  end
  if tags['oneway:bicycle'] == 'no' or tags['oneway:bicycle'] then
    result_tags['road_oneway:bicycle'] = tags['oneway:bicycle']
  end

  CopyTags(result_tags, tags, tags_copied)
  CopyTags(result_tags, tags, tags_prefixed, "osm_")
  result_tags.width = ParseLength(tags.width)
  result_tags.oneway = Sanitize(tags.oneway, { "yes", "no" })
  result_tags.bridge = Sanitize(tags.bridge, { "yes" })
  result_tags.tunnel = Sanitize(tags.tunnel, { "yes" })

  return result_tags
end
