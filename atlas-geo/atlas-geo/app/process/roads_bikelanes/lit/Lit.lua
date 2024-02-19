package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("CopyTags")
require("TimeUtils")
require("Set")

local tags_copied = {}
local tags_prefixed = {}

function Lit(object)
  local tags = object.tags
  local lit_data = {}

  -- Categorize the data in three groups: "lit", "unlit", "special"
  if tags.lit ~= nil then
    if (tags.lit == "yes" or tags.lit == "no") then
      lit_data.lit = tags.lit
    else
      lit_data.lit = "special"
    end
  end

  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Alit, https://overpass-turbo.eu/s/1lZW
  if tags["check_date:lit"] then
    lit_data.lit_age = AgeInDays(ParseDate(tags["check_date:lit"]))
  end

  CopyTags(lit_data, tags, tags_copied)
  CopyTags(lit_data, tags, tags_prefixed, "osm_")

  return lit_data
end
