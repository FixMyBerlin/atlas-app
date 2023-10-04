package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/surfaceQuality/?.lua"
require("TimeUtils")
require("SurfaceDirect")
require("NormalizeSmoothness")
require("DeriveSmoothness")
require("Set")
require("CopyTags")

function SurfaceQuality(object)
  -- Same as roadClassification, except for `HighwayClasses`

  local tags = object.tags

  local surface_data = {}

  local surface, surface_source = SurfaceDirect(tags.surface)

  -- Try to find smoothess information in the following order:
  -- 1. `smoothess` tag
  -- 2. `smoothess` extrapolated from `surface` data
  -- 3. `smoothess` extrapolated from `tracktype` tag, mostly on `highway=track`
  -- 4. `smoothess` extrapolated from `mtb:scale` tag, mostly on `highway=path`
  local todo = nil
  local smoothness, smoothness_source, smoothness_confidence = NormalizeSmoothness(tags.smoothness)
  if smoothness == nil then
    smoothness, smoothness_source, smoothness_confidence, todo = SmoothnessFromSurface(tags.surface)
  end
  if smoothness == nil then
    smoothness, smoothness_source, smoothness_confidence, todo = SmoothnessFromTrackType(tags.tracktype)
  end
  if smoothness == nil then
    smoothness, smoothness_source, smoothness_confidence, todo = SmoothnessFromMTBScale(tags["mtb:scale"])
  end

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

  surface_data.surface = surface
  surface_data.surface_source = surface_source
  -- tags.surface_confidence = surface_confidence -- only needed after we extended the surface normalization

  surface_data.smoothness = smoothness
  surface_data.smoothness_source = smoothness_source
  surface_data.smoothness_confidence = smoothness_confidence
  surface_data._todo = todo

  return surface_data
end
