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
  local surface_data = {}

  MergeTable(surface_data, DeriveSurface(tags))
  MergeTable(surface_data, DeriveSmoothness(tags))

  -- 77,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asurface
  if tags["check_date:surface"] then
    surface_data.surface_age = AgeInDays(ParseDate(tags["check_date:surface"]))
  end
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asmoothness
  if tags["check_date:smoothness"] then
    surface_data.smoothness_age = AgeInDays(ParseDate(tags["check_date:smoothness"]))
  end

  CopyTags(surface_data, tags, tags_copied)
  CopyTags(surface_data, tags, tags_prefixed, "osm_")

  return surface_data
end
