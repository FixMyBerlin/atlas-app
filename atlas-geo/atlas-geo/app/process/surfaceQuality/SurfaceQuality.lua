package.path = package.path ..
    ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/surfaceQuality/?.lua"
require("IsFresh")
require("SurfaceDirect")
require("SmoothnessDirect")
require("SmoothnessFromSurface")
require("Set")
require("CopyTags")

function SurfaceQuality(object)
  -- Same as roadClassification, except for `HighwayClasses`

  local tags = object.tags

  local surface_data = {}
  if object.tags.area == 'yes' then
    return {road_class_exlcuded="Exclude `area=yes`"}
  end

  local surface, surface_source = SurfaceDirect(tags.surface)

  -- Try to find smoothess information in the following order:
  -- 1. `smoothess` tag
  -- 2. `smoothess` extrapolated from surface data
  local todo = nil
  local smoothness, smoothness_source, smoothness_confidence = SmoothnessDirect(tags.smoothness)
  if smoothness == nil then
    smoothness, smoothness_source, smoothness_confidence, todo = SmoothnessFromSurface(tags.surface)
  end

  -- all tags that are shown on the application
  local tags_cc = {
    "name",
    "highway",
    "raw_surface",
    "raw_smoothness",
    "checkdate:surface",
    "checkdate:smoothness",
  }
  -- TODO: replace with copy
  CopyTags(tags, surface_data, tags_cc)

  -- Freshness of data (AFTER `FilterTags`!)
  IsFresh(object, "check_date:surface", tags, "surface")
  IsFresh(object, "check_date:smoothness", tags, "smoothness")

  surface_data.surface = surface
  surface_data.surface_source = surface_source
  -- tags.surface_confidence = surface_confidence -- only needed after we extended the surface normalization

  surface_data.smoothness = smoothness
  surface_data.smoothness_source = smoothness_source
  surface_data.smoothness_confidence = smoothness_confidence
  surface_data._todo = todo

  surface_data.is_present_surface = tags.surface ~= nil
  surface_data.is_present_smoothness = tags.smoothness ~= nil

  return surface_data
end
