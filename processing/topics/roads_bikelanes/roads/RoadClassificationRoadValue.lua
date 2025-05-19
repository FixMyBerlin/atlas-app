function RoadClassificationRoadValue(tags)
  local road_value = nil
  if (tags.highway == nil) then return road_value end

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- In general, we use the OSM highway value as category, but have a few special cases below.
  local highway_mapping = {
    road = "unspecified_road",
    steps = "footway_steps",
  }
  road_value = highway_mapping[tags.highway] or tags.highway

  -- Sidewalks
  if (tags.highway == 'footway' and tags.footway == 'sidewalk')
      or (tags.highway == 'path' and (tags.is_sidepath == 'yes' or tags.path == 'sidewalk')) then
    road_value = "footway_sidewalk"
  end

  -- Sidewalks Crossing
  if tags.highway == 'footway' and tags.footway == 'crossing' then
    road_value = "footway_crossing"
  end

  -- Bikelane Crossing
  if tags.highway == 'cycleway' and tags.cycleway == 'crossing' then
    road_value = "cycleway_crossing"
  end

  -- Foot- and Bicycle Crossing
  -- This is a strong simplification because we do not look at the access tags here.
  -- However, that should bring us pretty close without the added complexity.
  if tags.highway == 'path' and tags.path == 'crossing' then
    road_value = "footway_cycleway_crossing"
  end

  -- Vorfahrtsstraße, Zubringerstraße
  -- https://wiki.openstreetmap.org/wiki/DE:Key:priority_road
  if tags.highway == 'residential' then
    if tags.priority_road == 'designated' or tags.priority_road == 'yes_unposted' then
      road_value = "residential_priority_road"
    end
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
    road_value = service_mapping[tags.service] or 'service_uncategorized'
    -- https://taginfo.openstreetmap.org/keys/service#values
    if tags.service == nil then
      road_value = "service_road"
    end
  end

  -- Fahrradstraßen
  if tags.bicycle_road == 'yes' then
      -- traffic_sign=DE:244.1
      road_value = "bicycle_road"
  end

  return road_value
end
