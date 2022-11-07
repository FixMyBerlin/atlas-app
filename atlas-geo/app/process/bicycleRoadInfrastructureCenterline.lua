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
  name = 'bicycleRoadInfrastructureCenterline',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'offset', type='real'}
  }
})

-- TODO: estimate the width based on the road type when `width=nil`
--
local function roadWidth(tags)
  if tags["width"] ~= nil then
    return tonumber(tags["width"])
  end
  if tags["est_width"] ~= nil then
    return tonumber(tags["est_width"])
  end
  -- if tags["lanes"] ~= nil then
  --   return tonumber(tags["lanes"]) * 2.5
  -- end
  local streetWidths = {primary=10, secondary=8, tertiary=6, residential=6}
  if streetWidths[tags["highway"]] ~= nil then
    return streetWidths[tags["highway"]]
  end
    -- if tags["highway"] == "cycleway" then
  --   print(tags["cycleway"])
  -- end
  -- print(tags["highway"])
  -- print(tags["lanes"])
  -- print(tags["tracks"])
  return 6
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

  -- These are stored in a separated table because wen need to translate the geometry by half the road width
  local offsetDirections = {["cycleway:left"] = 1, ["cycleway:right"] = -1 }
  local trackVariants = Set({"track", "lane", "separate"})
  --  we miss trackVariant  = `shared_lane`
  for tag, sign in pairs(offsetDirections) do
    if trackVariants[object.tags[tag]] or trackVariants[object.tags["cycleway:both"]] then
      -- print(object.tags.name)
      object.tags.category = "cyclewaySeparated"
      object.tags._centerline = "tagged on centerline"
      object.tags._skip = false
      table:insert({
        tags = object.tags,
        geom = object:as_linestring(),
        offset = sign * roadWidth(object.tags) / 2
      })
    end
    if object.tags._centerline ~= nil then
      return
    end
  end

  local offsetDirections = {["sidewalk:left:bicycle"] = 1, ["sidewalk:right:bicycle"] = -1 }
  for tag, sign in pairs(offsetDirections) do
    if object.tags[tag] == "yes" or object.tags["sidewalk:both:bicycle"] == "yes" then
      object.tags.category = "footway_bicycleYes"
      object.tags._centerline = "tagged on centerline"
      object.tags._skip = false
      table:insert({
        tags = object.tags,
        geom = object:as_linestring(),
        offset = sign * roadWidth(object.tags) / 2
      })
    end
    if object.tags._centerline ~= nil then
      return
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
    "width",
    "est_width"
  })
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)
end
