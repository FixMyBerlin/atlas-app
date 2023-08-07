package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("MergeArray")
require("Metadata")
require("HighwayClasses")
require("JoinSets")
require("ExcludeHighways")
require("ExcludeByWidth")
require("IntoExcludeTable")
require("ConvertCyclewayOppositeSchema")

function RoadClassification(object)
  -- Values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)

  local roadClassification = {}
  local tags = object.tags

  -- Exclude sidewalk `(highway=footway) + footway=sidewalk`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if tags.footway == "sidewalk" then
    return { road_category_exlcuded = "Exclude `footway=sidewalk`" }
  end

  -- Exclude `is_sidepath=yes`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.is_sidepath == "yes" then
    return { road_category_exlcuded = "Exclude `is_sidepath=yes`" }
  end

  ConvertCyclewayOppositeSchema(tags)

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- We use the OSM highway value as category, but have a few special cases below.
  local highway_mapping = { road = "unspecified_road_category", steps = "footway" }
  roadClassification.road_category = highway_mapping[tags.highway] or tags.highway


  -- https://wiki.openstreetmap.org/wiki/DE:Key:service
  if tags.highway == "service" then
    local service_mapping = {
      alley = 'service_alley',
      driveway = 'service_driveway',
      parking_isle = 'service_parking_aisle'
    }
    -- Fallback:
    roadClassification.road_category = service_mapping[tags.service] or 'service_uncategorized'
    -- https://taginfo.openstreetmap.org/keys/service#values
    if tags.service == nil then
      tags.category = "service_road"
    end
  end

  if tags.bicycle_road == 'yes' then
    -- traffic_sign=DE:244.1
    roadClassification.road_category = "bicycle_road"
  end

  if tags.oneway == 'yes' then
    if tags['oneway:bicycle'] == 'no' then
      tags.oneway = 'car_not_bike'
    else
      tags.oneway = 'car_and_bike'
    end
    if tags.dual_carriageway == "yes" then
      tags.oneway = tags.oneway .. '_dual_carriageway'
    end
  end

  local tags_cc = Set({ "category", "name", "highway", "footway", "access", "service",
    "is_sidepath", "maxspeed", "surface", "smoothness", "oneway" })
  CopyTags(tags, roadClassification, tags_cc)

  return roadClassification
end
