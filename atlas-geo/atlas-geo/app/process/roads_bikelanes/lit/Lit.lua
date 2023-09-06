package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("CopyTags")
require("IsFresh")
require("Set")

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

function Lit(object)
  local tags = object.tags

  local lit_data = {}

  -- https://wiki.openstreetmap.org/wiki/Key:lit

  -- Categorize the data in three groups: "lit", "unlit", "special"
  if tags.lit ~= nil then
    lit_data.lit_category = "special"
    if (tags.lit == "yes") then
      lit_data.lit_category = "lit"
    end
    if (tags.lit == "no") then
      lit_data.lit_category = "unlit"
    end
  end

  -- Normalize name info for sidepath'
  -- TODO: Extact into helper
  tags.name = tags.name or tags['is_sidepath:of:name']

  local tags_cc = {
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
  }

  -- TODO: replace with copy
  CopyTags(tags, lit_data, tags_cc)

  -- Freshness of data (AFTER `FilterTags`!)
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Alit
  if lit_data.lit_category then
    IsFresh(object, 'check_date:lit', lit_data, 'lit')
  end
  return lit_data
end
