package.path = package.path ..
    ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/surfaceQuality/?.lua"
require("ExcludeHighways")
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
  local allowed_highways = JoinSets({ MajorRoadClasses, MinorRoadClasses, PathClasses })
  if not allowed_highways[object.tags.highway] then return end

  local tags = object.tags
  -- tags.raw_surface = tags.surface       -- Preserve original value since we use `surface` for our processed data
  -- tags.raw_smoothness = tags.smoothness -- Preserve original value since we use `smoothness` for our processed data

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  exclude, reason = ExcludeByWidth(object.tags, 2.1)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  if object.tags.area == 'yes' then
    IntoExcludeTable(excludeTable, object, "Exclude `area=yes`")
    return
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
  local allowed_tags = {
    "name",
    "highway",
    "raw_surface",
    "raw_smoothness",
    "checkdate:surface",
    "checkdate:smoothness",
  }
  FilterTags(tags, Set(allowed_tags))

  -- Freshness of data (AFTER `FilterTags`!)
  IsFresh(object, "checkdate:surface", tags, "surface")
  IsFresh(object, "checkdate:smoothness", tags, "smoothness")

  tags.surface = surface
  tags.surface_source = surface_source
  -- tags.surface_confidence = surface_confidence -- only needed after we extended the surface normalization

  tags.smoothness = smoothness
  tags.smoothness_source = smoothness_source
  tags.smoothness_confidence = smoothness_confidence
  tags._todo = todo

  tags.is_present_surface = tags.surface ~= nil
  tags.is_present_smoothness = tags.smoothness ~= nil

  table:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_linestring(),
  })
end
