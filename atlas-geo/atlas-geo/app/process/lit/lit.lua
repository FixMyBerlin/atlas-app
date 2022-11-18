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

local table = osm2pgsql.define_table({
  name = 'lit',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

-- Notes
-- =====
-- Which highways do we look at?
--  We should include sidewalks.
--  But ideally, we would exclude ways that are not network-relevant like cemetary footways

-- We ignore street lamps:
--  https://wiki.openstreetmap.org/wiki/Tag:highway%3Dstreet_lamp is not relevant for this data set

-- About nodes and relations:
--  process_node: We only look at highways
--  process_relation: We might need to add relations later; but for now ways should be enought

-- TODO: Process sidewalk:*, cycleway:* data othe centerline
--  Right now, we only look at the primary data.
--  We need to improve this, to copy the ways for sidewalks and cycleways that are not yet mapped separately. And apply the data on those ways as well.
--  Could we do this, by adding a _processing_instructions="move left".
--  We add those ways twice to the data … and post-process the in SQL?

function osm2pgsql.process_way(object)
  if not object.tags.highway then return end

  local allowed_values = HighwayClasses
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen)
  if not allowed_values[object.tags.highway] then return end

  object.tags._skipNotes = "init"
  object.tags._skip = false

  AddSkipInfoToHighways(object)
  AddSkipInfoByWidth(object)

  -- https://wiki.openstreetmap.org/wiki/Key:lit

  -- Categorize the data in three groups: "lit", "unlit", "special"
  if (object.tags.lit) then
    object.tags.category = "special"
    if (object.tags.lit == "yes") then
      object.tags.category = "lit"
    end
    if (object.tags.lit == "no") then
      object.tags.category = "unlit"
    end
  end

  -- Presence of data
  if (object.tags.lit) then
    object.tags.is_present = true
  else
    object.tags.is_present = false
  end

  -- Freshness of data
  local withinYears = CheckDataWithinYears(object.tags['check_date:lit'], 2)
  if (withinYears.result) then
    object.tags.is_fresh = true
    object.tags.fresh_age_days = withinYears.diffDays
  else
    object.tags.is_fresh = false
    object.tags.fresh_age_days = withinYears.diffDays
  end

  local allowed_tags = Set({
    "_skip",
    "_skipNotes",
    "access",
    "area",
    "category",
    "check_date:lit",
    "footway",
    "fresh_age_days",
    "highway",
    "is_fresh",
    "is_present",
    "is_sidepath",
    "lit",
    "surface",
    "smoothness",
    "name",
    "service",
    "width", -- experimental
    "sidewalk:width", -- experimental
    "cycleway:width", -- experimental
  })
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)

  if object.tags._skip then
  else
    table:insert({
      tags = object.tags,
      geom = object:as_linestring()
    })
  end
end
