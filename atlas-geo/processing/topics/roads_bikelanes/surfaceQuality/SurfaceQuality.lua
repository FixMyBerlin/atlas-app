package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/surfaceQuality/?.lua"
require("TimeUtils")
require("DeriveSurface")
require("DeriveSmoothness")
require("Set")
require("CopyTags")

local tags_copied = {}
local tags_prefixed = {}

function SurfaceQuality(object)
  local tags = object.tags
  local result_tags = {}

  MergeTable(result_tags, DeriveSurface(tags))
  MergeTable(result_tags, DeriveSmoothness(tags))

  -- 77,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asurface
  result_tags._surface_age = AgeInDays(ParseCheckDate(tags["check_date:surface"]))
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asmoothness
  result_tags._smoothness_age = AgeInDays(ParseCheckDate(tags["check_date:smoothness"]))

  CopyTags(result_tags, tags, tags_copied)
  CopyTags(result_tags, tags, tags_prefixed, "osm_")

  return result_tags
end
