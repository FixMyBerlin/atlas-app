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

local table = osm2pgsql.define_table({
  name = 'roadClassification',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local excludeTable = osm2pgsql.define_table({
  name = 'roadClassification_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',   type = 'jsonb' },
    { column = 'meta',   type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom',   type = 'linestring' },
  }
})

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  -- Values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_highways[object.tags.highway] then return end

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  exclude, reason = ExcludeByWidth(object.tags, 2.1)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  if object.tags.area == 'yes' then
    IntoExcludeTable(excludeTable, object, "Exclude `area=yes`")
    return
  end

  -- Exclude sidewalk `(highway=footway) + footway=sidewalk`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.footway == "sidewalk" then
    IntoExcludeTable(excludeTable, object, "Exclude `footway=sidewalk`")
    return
  end

  -- Exclude `is_sidepath=yes`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.is_sidepath == "yes" then
    IntoExcludeTable(excludeTable, object, "Exclude `is_sidepath=yes`")
    return
  end

  ConvertCyclewayOppositeSchema(object.tags)

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- We use the OSM value as category, but have a few special cases below.
  object.tags.category = object.tags.highway
  if object.tags.highway == "road" then
    object.tags.category = "unspecified_road_category"
  end

  -- https://wiki.openstreetmap.org/wiki/DE:Key:service
  if object.tags.highway == "service" then
    -- Fallback:
    object.tags.category = 'service_uncategorized'
    -- https://taginfo.openstreetmap.org/keys/service#values
    if object.tags.service == nil then
      object.tags.category = "service_road"
    end
    if object.tags.service == 'alley' then
      object.tags.category = "service_alley"
    end
    if object.tags.service == 'driveway' then
      object.tags.category = "service_driveway"
    end
    if object.tags.service == 'parking_aisle' then
      object.tags.category = "service_parking_aisle"
    end
  end

  if object.tags.bicycle_road == 'yes' then
    -- traffic_sign=DE:244.1
    object.tags.category = "bicycle_road"
  end

  if object.tags.highway == 'steps' then
    -- Simplify steps as part of the walkable network
    object.tags.category = "footway"
  end

  if object.tags.oneway == 'yes' then
    if object.tags['oneway:bicycle'] == 'no' then
      object.tags.oneway = 'car_not_bike'
    else
      object.tags.oneway = 'car_and_bike'
    end
  end

  local allowed_tags = Set({ "category", "name", "highway", "footway", "access", "service",
    "is_sidepath", "maxspeed", "surface", "smoothness", "oneway" })
  FilterTags(object.tags, allowed_tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_linestring()
  })
end
