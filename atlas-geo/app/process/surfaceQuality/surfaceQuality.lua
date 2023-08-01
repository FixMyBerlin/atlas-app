package.path = package.path ..
    ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/surfaceQuality/?.lua"
require("ExcludeHighways")
require("ExcludeByWidth")
require("FilterTags")
require("HighwayClasses")
require("IntoExcludeTable")
require("IsFresh")
require("JoinSets")
require("SurfaceDirect")
require("SmoothnessDirect")
require("SmoothnessFromSurface")
require("Metadata")
require("Set")

local table = osm2pgsql.define_table({
  name = "surfaceQuality",
  ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
  columns = {
    { column = "tags", type = "jsonb" },
    { column = "meta", type = "jsonb" },
    { column = "geom", type = "linestring" }
  }
})

-- Roads that we exlude from our analysis
local excludeTable = osm2pgsql.define_table({
  name = "surfaceQuality_excluded",
  ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
  columns = {
    { column = "tags",   type = "jsonb" },
    { column = "meta",   type = "jsonb" },
    { column = "reason", type = "text" },
    { column = "geom",   type = "linestring" }
  }
})

function osm2pgsql.process_way(object)
  -- Same as roadClassification, except for `HighwayClasses`

  local tags = object.tags
  local allowed_highways = JoinSets({ MajorRoadClasses, MinorRoadClasses, PathClasses })

  if not allowed_highways[tags.highway] then
    return
  end


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
  SURFACE_TAGS = {
    "name",
    "highway",
    "raw_surface",
    "raw_smoothness",
    "checkdate:surface",
    "checkdate:smoothness",
  }
  -- TODO: replace with copy
  FilterTags(tags, Set(SURFACE_TAGS))

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
