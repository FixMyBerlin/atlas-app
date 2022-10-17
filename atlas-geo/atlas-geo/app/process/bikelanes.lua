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
require("AddSkipInfoToHighways")
require("StartsWith")

local table = osm2pgsql.define_table({
  name = 'bikelanes',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local skipTable = osm2pgsql.define_table({
  name = 'bikelanes_skipList',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local toTranslateTable = osm2pgsql.define_table({
  name = 'bicycleRoadInfrastructure_toTranslate',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type='real'}
  }
})

-- TODO: return `width` if tagged otherwise estimate the width based on the road type
local function roadWidth(tags)
  return 2.5
end

local function insert(object)
  table:insert({
    tags = object.tags,
    geom = object:as_linestring()
  })
end
function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_values[object.tags.highway] then return end

  object.tags._skipNotes = "Skipped by default `true`"
  object.tags._skip = true

  AddSkipInfoToHighways(object)

  -- Skip `highway=steps`
  -- We don't look at ramps on steps ATM. That is not good bicycleInfrastructure anyways
  if object.tags.highway == "steps" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=steps`"
    object.tags._skip = true
  end

  -- Handle `highway=pedestrian + bicycle=yes/!=yes`
  -- Include "Fußgängerzonen" only when explicitly allowed for bikes. "dismount" does counts as "no"
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dpedestrian
  if object.tags.highway == "pedestrian" then
    if object.tags.bicycle == "yes" then
      object.tags.category = "pedestrianArea_bicycleYes"
      insert(object)
      return
    else
      object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=pedestrian + bicycle!=yes`"
      object.tags._skip = true
    end
  end

  -- Handle `highway=living_street`
  -- DE: Verkehrsberuhigter Bereich AKA "Spielstraße"
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dliving_street
  if object.tags.highway == "living_street" and not object.tags.bicycle == "no" then
    object.tags.category = "livingStreet"
    insert(object)
    return
  end

  -- Handle `bicycle_road=yes` and traffic_sign
  -- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
  if object.tags.bicycle_road == "yes"
      or StartsWith(object.tags.traffic_sign, "DE:244") then
    object.tags.category = "bicycleRoad"
    insert(object)
    return
  end

  -- Handle "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
  -- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:240
  if (object.tags.bicycle == "designated" and object.tags.foot == "designated" and object.tags.segregated == "no")
      or StartsWith(object.tags.traffic_sign, "DE:240") then
    object.tags.category = "footAndCycleway_shared"
    insert(object)
    return
  end

  -- Handle "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
  -- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-30
  -- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-31
  if (object.tags.bicycle == "designated" and object.tags.foot == "designated" and object.tags.segregated == "yes")
      or StartsWith(object.tags.traffic_sign, "DE:241") then
    object.tags.category = "footAndCycleway_segregated"
    insert(object)
    return
  end

  -- Handle "Gehweg, Fahrrad frei"
  -- traffic_sign=DE:239,1022-10, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:239
  if object.tags.highway == "footway" or object.tags.highway == "path" then
    if object.tags["mtb:scale"] then
      -- The access based tagging would include free running path through woods like https://www.openstreetmap.org/way/23366687
      -- We filter those based on mtb:scale=*.
      object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=footway|path` but `mtb:scale`"
      object.tags._skip = true
    end
    -- Note: We might be missing some traffic_sign that have mulibe secondary signs like "DE:239,123,1022-10". That's OK for now…
    -- Note: For ZES we explicity checked that the traffic_sign is not on a highway=cycleway; we do the same here but differently
    if object.tags.bicycle == "yes"
        or StartsWith(object.tags.traffic_sign, "DE:239,1022-10") then
      object.tags.category = "footway_bicycleYes"
      insert(object)
      return
    end
  end

  -- Handle "baulich abgesetzte Radwege" ("Protected Bike Lane")
  -- This part relies heavly on the `is_sidepath` tagging.
  if  -- Case: Separate cycleway next to a road
      -- Eg https://www.openstreetmap.org/way/278057274
      object.tags.highway == "cycleway" and object.tags.is_sidepath == "yes" or
      -- Case: The crossing version of a separate cycleway next to a road
      -- The same case as the is_sidepath=yes above, but on crossings we don't set that.
      -- Eg https://www.openstreetmap.org/way/963592923
      (object.tags.highway == "cycleway" and object.tags.cycleway == "crossing" ) or
      -- Case: Separate cycleway identified via traffic_sign
      -- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
      -- Eg https://www.openstreetmap.org/way/964476026
      (object.tags.traffic_sign == "DE:237" and object.tags.is_sidepath == "yes") or
      -- Case: Separate cycleway idetified via "track"-tagging.
      --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dtrack
      --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_track
      -- … separately mapped
      object.tags.cycleway == "track" or object.tags.cycleway == "opposite_track"
    then
    object.tags.category = "cyclewaySeparated"
    insert(object)
    return
  end

  -- Handle "frei geführte Radwege", dedicated cycleways that are not next to a road
  -- Eg. https://www.openstreetmap.org/way/27701956
  -- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
  if object.tags.highway == "cycleway"
      and object.tags.traffic_sign == "DE:237"
      and (object.tags.is_sidepath == nil or object.tags.is_sidepath == "no") then
    object.tags.category = "cyclewayAlone"
    insert(object)
    return
  end

  -- TODO CENTERLINE: This handles sidewalks tagged on the centerline. But we would like those to be separate geometries ideally.
  -- Maybe we can …
  -- 1. add internal tags like "_centerline=right" here
  -- 2. use those to create duplicated geometries with multiple insert calls below
  -- 3. selecte those duplicated geoms and move them left/right of the centerline (based on the _centerline=left + _centerlineOffset = <RoadWith|DefaultByRoadClass>) in PostGIS?

  -- Possible solution:
  -- 1. store all centerline tagged bike paths in separate table `toTranslateTable` with extra column `offset`
  -- 2. `offset` is calculated based on <RoadWith|DefaultByRoadClass> and the sign indicates left/right
  -- 3. translate geometries by `offset` in PostGIS and join the result into the main table
  local offsets = {["cycleway:left"] = 1, ["cycleway:right"] = -1 }
  for tag, offset in pairs(offsets) do
    if object.tags[tag] == "track" or object.tags["cycleway:both"] == "track" then
      object.tags.category = "cyclewaySeparated"
      object.tags._centerline = "tagged on centerline"
      object.tags._skip = false
      toTranslateTable:insert({
        tags = object.tags,
        geom = object:as_linestring(),
        offset = offset * roadWidth(object.tags)
      })
    end
  end
  for tag, offset in pairs(offsets) do
    if object.tags[tag] == "lane" or object.tags["cycleway:both"] == "lane" then
      object.tags.category = "cyclewaySeparated_line"
      object.tags._centerline = "tagged on centerline"
      object.tags._skip = false
      toTranslateTable:insert({
        tags = object.tags,
        geom = object:as_linestring(),
        offset = offset * roadWidth(object.tags)
      })
    end
  end

  local offsets = {["sidewalk:left:bicycle"] = 1, ["sidewalk:right:bicycle"] = -1 }
  for tag, offset in pairs(offsets) do
    if object.tags[tag] == "yes" or object.tags["sidewalk:both:bicycle"] == "yes" then
      object.tags.category = "footway_bicycleYes"
      object.tags._centerline = "tagged on centerline"
      object.tags._skip = false
      toTranslateTable:insert({
        tags = object.tags,
        geom = object:as_linestring(),
        offset = offset * roadWidth(object.tags)
      })
    end
  end

  -- TODO SKIPLIST: For ZES, we skip "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts

  local allowed_tags = Set({
    "_centerline",
    "_skip",
    "_skipNotes",
    "access",
    "bicycle_road",
    "bicycle",
    "category",
    "cycleway:both",
    "cycleway:left",
    "cycleway:right",
    "cycleway",
    "foot",
    "footway",
    "highway",
    "is_sidepath",
    "mtb:scale",
    "name",
    "segregated",
    "sidewalk:both:bicycle",
    "sidewalk:left:bicycle",
    "sidewalk:right:bicycle",
    "traffic_sign",
  })
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)

  if object.tags._skip then
    -- skip tag is no longer needed
    object.tags._skip = nil
    skipTable:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  end
end
