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
require("AddSkipInfoByWidth")
require("CheckDataWithinYears")
require("StartsWith")

local table = osm2pgsql.define_table({
  name = 'bikelanesNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local skipTable = osm2pgsql.define_table({
  name = 'bikelanes_skipListNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})


local translateTable = osm2pgsql.define_table({
  name = 'bikelanesCenterlineNew',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type = 'real' }
  }
})

local function roadWidth(tags)
  -- if tags["width"] ~= nil then
  --   return tonumber(string.gmatch(tags["width"], "[^%s;]+")())
  -- end
  -- if tags["est_width"] ~= nil then
  --   return tonumber(string.gmatch(tags["est_width"], "[^%s;]+")())
  -- end
  -- local streetWidths = {primary=10, secondary=8, tertiary=6, residential=6}
  -- if streetWidths[tags["highway"]] ~= nil then
  --   return streetWidths[tags["highway"]]
  -- end
  return 8
end

-- PREDICATES FOR EACH CATEGORY:

-- Handle `highway=pedestrian + bicycle=yes/!=yes`
-- Include "Fußgängerzonen" only when explicitly allowed for bikes. "dismount" does counts as "no"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dpedestrian
-- tag: "pedestrianArea_bicycleYes"
local function pedestiranArea(tags)
  local results = tags.highway == "pedestrian" and tags.bicycle == "yes"
  if result then
    tags.category = "pedestrianArea_bicycleYes"
  end
  return results
end

-- Handle `highway=living_street`
-- DE: Verkehrsberuhigter Bereich AKA "Spielstraße"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dliving_street
-- tag: "livingStreet"
local function livingStreet(tags)
  local result = tags.highway == "living_street" and not tags.bicycle == "no"
  if result then
    tags.category = "livingStreet"
  end
  return result
end

-- Handle `bicycle_road=yes` and traffic_sign
-- https://wiki.openstreetmap.org/wiki/DE:Key:bicycle%20road
-- tag: "bicycleRoad"
local function bicycleRoad(tags)
  local result = tags.bicycle_road == "yes" or StartsWith(tags.traffic_sign, "DE:244")
  if result then
    tags.category = "bicycleRoad"
  end
  return result
end

-- Handle "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
-- traffic_sign=DE:240, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:240
-- tag: "footAndCycleway_shared"
local function footAndCycleway(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "no"
  result = result or StartsWith(tags.traffic_sign, "DE:240")
  if result then
    tags.category = "footAndCycleway_shared"
  end
  return result
end

-- Handle "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
-- traffic_sign=DE:241-30, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-30
-- traffic_sign=DE:241-31, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241-31
-- tag: "footAndCycleway_segregated"
local function footAndCyclewaySegregated(tags)
  local result = tags.bicycle == "designated" and tags.foot == "designated" and tags.segregated == "yes"
  result = result or StartsWith(tags.traffic_sign, "DE:241")
  if result then
    tags.category = "footAndCycleway_segregated"
  end
  return result
end

-- Handle "Gehweg, Fahrrad frei"
-- traffic_sign=DE:239,1022-10, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:239
-- tag: "footway_bicycleYes"
local function footwayBicycleAllowed(tags)
  local result = tags.highway == "footway" or tags.highway == "path"
  -- Note: We might be missing some traffic_sign that have mulibe secondary signs like "DE:239,123,1022-10". That's OK for now…
  -- Note: For ZES we explicity checked that the traffic_sign is not on a highway=cycleway; we do the same here but differently
  result = result and (tags.bicycle == "yes" or StartsWith(tags.traffic_sign, "DE:239,1022-10") or tags.traffic_sign == 'DE:1022-10')
  -- The access based tagging would include free running path through woods like https://www.openstreetmap.org/way/23366687
  -- We filter those based on mtb:scale=*.
  result = result and not tags["mtb:scale"]
  if result then
    tags.category = "footway_bicycleYes"
  end
  return result
end

-- Handle "baulich abgesetzte Radwege" ("Protected Bike Lane")
-- This part relies heavly on the `is_sidepath` tagging.
-- tag: "cyclewaySeparated"
local function cyclewaySeperated(tags)
  -- Case: Separate cycleway next to a road
  -- Eg https://www.openstreetmap.org/way/278057274
  local result = (tags.highway == "cycleway" and tags.is_sidepath == "yes")
  -- Case: The crossing version of a separate cycleway next to a road
  -- The same case as the is_sidepath=yes above, but on crossings we don't set that.
  -- Eg https://www.openstreetmap.org/way/963592923
  result = result or (tags.highway == "cycleway" and tags.cycleway == "crossing")
  -- Case: Separate cycleway identified via traffic_sign
  -- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
  -- Eg https://www.openstreetmap.org/way/964476026
  result = result or (tags.traffic_sign == "DE:237" and tags.is_sidepath == "yes")

  -- TODO: cases bellow should be handled in center line logic
  -- Case: Separate cycleway idetified via "track"-tagging.
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dtrack
  --    https://wiki.openstreetmap.org/wiki/DE:Tag:cycleway%3Dopposite_track
  -- … separately mapped
  result = result or (tags.cycleway == "track" or tags.cycleway == "opposite_track")
  -- TODO: comment
  -- result = result or (tags.cycleway == "lane" or tags.cycleway == "opposite_lane")
  if result then
    tags.category = "cyclewaySeparated"
  end
  return result
end

-- deprecated only for backwards compatibility
local function oldCenterline(tags)
  if tags["sidewalk:left:bicycle"] == "yes" or tags["sidewalk:right:bicycle"] == "yes" or tags["sidewalk:both:bicycle"] then
    tags._centerline = "tagged on centerline"
    tags.category = "footway_bicycleYes"
    return true
  end
  if tags["cycleway:right"] == "track" or tags["cycleway:left"] == "track" or tags["cycleway:both"] == "track" then
    tags.category = "cyclewaySeparated"
    tags._centerline = "tagged on centerline"
    return true
  end
  return false
end

-- Handle "frei geführte Radwege", dedicated cycleways that are not next to a road
-- Eg. https://www.openstreetmap.org/way/27701956
-- traffic_sign=DE:237, https://wiki.openstreetmap.org/wiki/DE:Tag:traffic%20sign=DE:237
-- tag: "cyclewayAlone"
local function cycleWayAlone(tags)
  local result = tags.highway == "cycleway" and tags.traffic_sign == "DE:237"
  result = result and (tags.is_sidepath == nil or tags.is_sidepath == "no")
  if result then
    tags.category = "cyclewayAlone"
  end
  return result
end

-- whitelist of tags we want to insert intro the DB
local allowed_tags = Set({
  "_centerline",
  "_skip",
  "_skipNotes",
  "_direction",
  "_offset",
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
  "width", -- experimental
  "sidewalk:width", -- experimental
  "cycleway:width", -- experimental
  "surface",
  "smoothness",
  "traffic_sign",
})

local predicates = { pedestiranArea, livingStreet, bicycleRoad, footAndCycleway, footAndCyclewaySegregated,
  footwayBicycleAllowed, cyclewaySeperated, cycleWayAlone }

local function applyPredicates(tags)
  for _, predicate in pairs(predicates) do
    if predicate(tags) then
      return true
    end
  end
  return false
end

local function normalizeTags(object)
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)
  -- Presence of data
  if (object.tags.category) then
    object.tags.is_present = true
  else
    object.tags.is_present = false
  end

  -- Freshness of data, see documentation
  local withinYears = CheckDataWithinYears(object.tags["check_date:cycleway"], 2)
  if (withinYears.result) then
    object.tags.is_fresh = true
    object.tags.fresh_age_days = withinYears.diffDays
  else
    object.tags.is_fresh = false
    object.tags.fresh_age_days = withinYears.diffDays
  end
end

local function intoSkipList(object)
  normalizeTags(object)
  skipTable:insert({
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


  AddSkipInfoToHighways(object)
  -- Skip `highway=steps`
  -- We don't look at ramps on steps ATM. That is not good bicycleInfrastructure anyways
  if object.tags.highway == "steps" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=steps`"
    object.tags._skip = true
  end
  if object.tags._skip == true then
    intoSkipList(object)
    return
  end


  -- apply predicates
  if applyPredicates(object.tags) then
    object.tags._skipNotes = nil
    normalizeTags(object)
    table:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
    -- in future versions we should do this as a concationation of the tables(sql)
    translateTable:insert({
      tags = object.tags,
      geom = object:as_linestring(),
      offset = 0
    })
    return
  end

  -- this is only to stay consistent with the previous version
  if oldCenterline(object.tags) then
    object.tags._skipNotes = nil
    normalizeTags(object)
    table:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  end

  -- apply predicates nested
  -- transformations:
  local footwayTransformer = {
    highway = "footway",
    dest = "bicycle",
    tags = {
      ["sidewalk:left:bicycle"] = { 1 },
      ["sidewalk:right:bicycle"] = { -1 },
      ["sidewalk:both:bicycle"] = { -1, 1 },
    },
  }
  local cyclewayTransformer = {
    highway = "cycleway",
    dest = "cycleway",
    tags = {
      ["cycleway:left"] = { 1 },
      ["cycleway:right"] = { -1 },
      ["cycleway:both"] = { -1, 1 },
    },
  }
  local transformations = { footwayTransformer, cyclewayTransformer }

  for _, transformer in pairs(transformations) do
    -- set the highway category
    local cycleway = { highway = transformer.highway }
    -- NOTE: the category/transformer should also influence the offset e.g. a street with bike lane should have less offset than a sidewalk with bicycle=yes approx. the width of the bike lane itself
    local offset = roadWidth(object.tags) / 2
    for tag, signs in pairs(transformer.tags) do
      if object.tags[tag] ~= nil and object.tags[tag] ~= "no" then
        -- sets the bicycle tag to the value of nested tags
        cycleway[transformer.dest] = object.tags[tag]
        if applyPredicates(cycleway) then
          object.tags._centerline = "tagged on centerline"
          for _, sign in pairs(signs) do
            object.tags._skipNotes = nil
            object.tags.category = cycleway.category
            normalizeTags(object)
            translateTable:insert({
              tags = object.tags,
              geom = object:as_linestring(),
              offset = sign * offset
            })
          end
        end
      end
    end
  end

  -- TODO SKIPLIST: For ZES, we skip "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts
  if object.tags.category == nil then
    intoSkipList(object)
  end
end
