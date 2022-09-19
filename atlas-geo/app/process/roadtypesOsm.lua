package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")
require("HighwayClasses")

local table = osm2pgsql.define_table({
  name = 'roadtypesOsm',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local skipTable = osm2pgsql.define_table({
  name = 'roadtypesOsm_skipList',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses
  -- values that we would allow, but skip here:
  -- "steps", , "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_values[object.tags.highway] then return end

  object.tags._skipNotes = "init"
  object.tags._skip = false

  -- Skip all non standard access values
  local allowed_access_values = Set({ "private", "no", "destination", "delivery", "permit" })
  if object.tags.access and allowed_access_values[object.tags.access] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `allowed_access_values`"
    object.tags._skip = true
  end

  if object.tags.operator == 'private' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `operator=private`"
    object.tags._skip = true
  end

  if object.tags.foot == 'private' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `foot=private`"
    object.tags._skip = true
  end

  if object.tags.indoor == 'yes' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `indoor=yes`"
    object.tags._skip = true
  end

  if object.tags.informal == 'yes' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `informal=yes`"
    object.tags._skip = true
  end

  if object.tags['mtb:scale'] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped since `mtb:scale` indicates a special interest path"
    object.tags._skip = true
  end

  if object.tags.tracktype == "grade5" then
    object.tags._skipNotes = object.tags._skipNotes ..
        ";Skipped since `tracktype=grade5` indicates a special interest path"
    object.tags._skip = true
  end

  ToNumber(object.tags, Set({ 'width' }))
  if object.tags.width and object.tags.width < 2.1 then
    object.tags._skipNotes = object.tags._skipNotes ..
        ";Skipped since `width<2.1m` indicates a special interest path"
    object.tags._skip = true
  end

  -- Skip all unwanted `highway=service + service=<value>` values
  -- The key can have random values, we maintly want to skip "driveway", "parking_aisle".
  local skip_service_values = Set({ "alley", "drive-through", "emergency_access" })
  if object.tags.service and not skip_service_values[object.tags.service] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `skip_service_values`"
    object.tags._skip = true
  end

  -- Skip sidewalk `(highway=footway) + footway=sidewalk`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.footway == "sidewalk" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `footway=sidewalk`"
    object.tags._skip = true
  end

  -- Skip `is_sidepath=yes`
  -- Including "Fahrrad frei" https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:1022-10
  if object.tags.is_sidepath == "yes" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `is_sidepath=yes`"
    object.tags._skip = true
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

  local allowed_tags = Set({ "_skip", "_skipNotes", "category", "name", "highway", "footway", "access", "service",
    "is_sidepath" })
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)

  if object.tags._skip then
    skipTable:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  else
    table:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  end
end
