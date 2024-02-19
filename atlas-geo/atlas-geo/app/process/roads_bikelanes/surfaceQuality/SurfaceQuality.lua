package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/surfaceQuality/?.lua"
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
  if tags["check_date:surface"] then
    result_tags.surface_age = AgeInDays(ParseDate(tags["check_date:surface"]))
  end
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asmoothness
  if tags["check_date:smoothness"] then
    result_tags.smoothness_age = AgeInDays(ParseDate(tags["check_date:smoothness"]))
  end

  CopyTags(result_tags, tags, tags_copied)
  CopyTags(result_tags, tags, tags_prefixed, "osm_")

  return result_tags
end
