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

  surface_data.surface, surface_data.surface_source = DeriveSurface(tags)
  --surface_data.surface, surface_data.surface_source, surface_data.surface_confidence = DeriveSurface(tags)-- only needed after we extended the surface normalization

  surface_data.smoothness, surface_data.smoothness_source, surface_data.smoothness_confidence = DeriveSmoothness(tags)

  -- all tags that are shown on the application
  local tags_cc = {
    "name",
    "highway",
    "surface",
    "smoothness",
  }
  CopyTags(tags, surface_data, tags_cc, "osm_")

  -- 77,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asurface
  if tags["check_date:surface"] then
    surface_data.surface_age = AgeInDays(ParseDate(tags["check_date:surface"]))
  end
  -- 4,000+ https://taginfo.openstreetmap.org/keys/check_date%3Asmoothness
  if tags["check_date:smoothness"] then
    surface_data.smoothness_age = AgeInDays(ParseDate(tags["check_date:smoothness"]))
  end


  return surface_data
end
