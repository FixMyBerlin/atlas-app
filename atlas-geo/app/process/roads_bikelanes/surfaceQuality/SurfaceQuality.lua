package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/surfaceQuality/?.lua"
require("TimeUtils")
require("DeriveSurface")
require("DeriveSmoothness")
require("Set")
require("CopyTags")

function SurfaceQuality(object)
  -- Same as roadClassification, except for `HighwayClasses`

  local tags = object.tags

  local surface_data = {}

  MergeTable(surface_data, DeriveSurface(tags))
  MergeTable(surface_data, DeriveSmoothness(tags))


  -- 77,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asurface
  surface_data.surface_age = AgeInDays(ParseCheckDate(tags["check_date:surface"]))
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asmoothness
  surface_data.smoothness_age = AgeInDays(ParseCheckDate(tags["check_date:smoothness"]))


  return surface_data
end
