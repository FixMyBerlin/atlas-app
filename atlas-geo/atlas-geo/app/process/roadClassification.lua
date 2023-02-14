package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("MergeArray")
require("Metadata")
require("HighwayClasses")
require("ExcludeHighways")
require("ExcludeByWidth")

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
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_values[object.tags.highway] then return end


  --TODO: exit here
  local exclude, reason = ExcludeHighways(object.tags)
  object.tags._exclude = exclude
  object.tags._excludeNotes = reason
  exclude, reason = ExcludeByWidth(object.tags, 2.1)
  object.tags._exclude = object.tags._exclude or exclude
  object.tags._excludeNotes = object.tags._excludeNotes .. reason

  -- Exclude sidewalk `(highway=footway) + footway=sidewalk`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.footway == "sidewalk" then
    object.tags._excludeNotes = object.tags._excludeNotes .. ";Exclude `footway=sidewalk`"
    object.tags._exclude = true
  end

  -- Exclude `is_sidepath=yes`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.is_sidepath == "yes" then
    object.tags._excludeNotes = object.tags._excludeNotes .. ";Exclude `is_sidepath=yes`"
    object.tags._exclude = true
  end

  -- https://wiki.openstreetmap.org/wiki/DE:Key:highway
  -- We use the OSM value as category, but have a few special cases below.
  object.tags.category = object.tags.highway
  if object.tags.highway == "road" then
    object.tags.category = "unspecified_road_category"
  end
  if object.tags.highway == "service" then
    -- https://wiki.openstreetmap.org/wiki/DE:Key:service
    if object.tags.service == 'alley' then
      object.tags.category = "service_alley"
    end
    if object.tags.service == 'drive-through' then
      object.tags.category = "service_drive_through"
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

  local allowed_tags = Set({ "_exclude", "_excludeNotes", "category", "name", "highway", "footway", "access", "service",
    "is_sidepath" })
  FilterTags(object.tags, allowed_tags)

  if object.tags._exclude then
    excludeTable:insert({
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
  else
    table:insert({
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
  end
end
