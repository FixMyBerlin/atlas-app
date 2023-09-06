package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("MergeArray")
require("JoinSets")
require("Metadata")
require("HighwayClasses")
require("ExcludeHighways")
require("ExcludeByWidth")
require("IsFresh")

local table = osm2pgsql.define_table({
  name = 'lit',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'category', type = 'text' },
    { column = 'tags',     type = 'jsonb' },
    { column = 'meta',     type = 'jsonb' },
    { column = 'geom',     type = 'linestring' },
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

  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  -- values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen)
  if not allowed_highways[object.tags.highway] then return end
  if ExcludeHighways(object.tags) or ExcludeByWidth(object.tags, 2.1) then
    return
  end

  -- https://wiki.openstreetmap.org/wiki/Key:lit

  -- Categorize the data in three groups: "lit", "unlit", "special"
  local category = nil
  if object.tags.lit == nil then
    object.tags.is_present = false
  else
    object.tags.is_present = true
    category = "special"
    if (object.tags.lit == "yes") then
      category = "lit"
    end
    if (object.tags.lit == "no") then
      category = "unlit"
    end
  end

  -- Normalize name info for sidepath'
  -- TODO: Extact into helper
  object.tags.name = object.tags.name or object.tags['is_sidepath:of:name']

  local allowed_tags = Set({
    "access",
    "area",
    "category",
    "check_date:lit",
    "footway",
    "highway",
    "is_present",
    "is_sidepath",
    "lit",
    "surface",
    "smoothness",
    "name",
    "service",
    "width",          -- experimental
    "sidewalk:width", -- experimental
    "cycleway:width", -- experimental
  })
  FilterTags(object.tags, allowed_tags)

  -- Freshness of data (AFTER `FilterTags`!)
  if (object.tags.is_present == true) then
    IsFresh(object, 'check_date:lit', object.tags)
  end

  if object.tags._exclude then
  else
    table:insert({
      category = category,
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
  end
end
