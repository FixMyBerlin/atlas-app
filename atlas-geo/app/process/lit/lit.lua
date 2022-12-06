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
  name = 'lit_new',
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
  if(object.tags.is_present == true) then
    -- (0) Only handle cases where our main data is present
    if(object.tags['check_date:lit']) then
      -- (1) If check_date is present, use it
      local withinYears = CheckDataWithinYears(object.tags['check_date:lit'], 2)
      if (withinYears.result) then
        object.tags.fresh = 'fresh_check_date'
        object.tags.fresh_age_days = withinYears.diffDays
        object.tags._freshNotes = 'check_date used; fresh=true; confidence=high'
      else
        object.tags.fresh = 'outdated_check_date'
        object.tags.fresh_age_days = withinYears.diffDays
        object.tags._freshNotes = 'check_date used; fresh=false; confidence=high'
      end
    else
      -- (2) Fall back to object's last update date
      local withinYears = CheckDataWithinYears(os.date('!%Y-%m-%d', object.timestamp), 2)
      if(withinYears.result) then
        object.tags.fresh = 'fresh_update_at'
        object.tags.fresh_age_days = withinYears.diffDays
        object.tags._freshNotes = 'update_at used; fresh=true; confidence=low'
      else
        object.tags.fresh = 'outdated_update_at'
        object.tags.fresh_age_days = withinYears.diffDays
        object.tags._freshNotes = 'update_at used; fresh=false; confidence=low'
      end
    end
  else
    object.tags._freshNotes = 'is_present=false, so fresh data skipped'
  end

  -- Normalize name info for sidepath'
  -- TODO: Extact into helper
  object.tags.name = object.tags.name or object.tags['is_sidepath:of:name']

  local allowed_tags = Set({
    "_skip",
    "_skipNotes",
    "_combined_fresh_age_days",
    "_combined_is_fresh",
    "_update_fresh_age_days",
    "_update_is_fresh",
    "access",
    "area",
    "category",
    "check_date:lit",
    "footway",
    "fresh",
    "fresh_age_days",
    "_freshNotes",
    "highway",
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
