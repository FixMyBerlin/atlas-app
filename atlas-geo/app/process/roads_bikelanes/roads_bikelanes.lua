package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
local dir = ";/app/process/roads_bikelanes/"
package.path = package.path .. dir .. "roadClassification/?.lua"
package.path = package.path .. dir .. "maxspeed/?.lua"
package.path = package.path .. dir .. "surfaceQuality/?.lua"
package.path = package.path .. dir .. "lit/?.lua"
package.path = package.path .. dir .. "bikelanes/?.lua"

require("Set")
require("JoinSets")
require("Metadata")
require("ExcludeHighways")
require("ExcludeByWidth")
require("IntoExcludeTable")
require("ConvertCyclewayOppositeSchema")
require("Maxspeed")
require("Lit")
require("RoadClassification")
require("SurfaceQuality")
require("Bikelanes")
require("MergeTable")

local roadsTable = osm2pgsql.define_table({
  name = 'roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local excludedRoadsTable = osm2pgsql.define_table({
  name = 'roads_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',   type = 'jsonb' },
    { column = 'meta',   type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom',   type = 'linestring' },
  }
})


function osm2pgsql.process_way(object)
  local tags = object.tags

  ConvertCyclewayOppositeSchema(tags)
  if not tags.highway then return end

  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  -- Values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_highways[tags.highway] then return end

  local exclude, reason = ExcludeHighways(tags)
  if exclude then
    IntoExcludeTable(excludedRoadsTable, object, reason)
    return
  end
  if object.tags.area == 'yes' then
    IntoExcludeTable(excludedRoadsTable, object, "Exclude `area=yes`")
    return
  end

  -- TODO: move to ExcludeHighways
  -- TODO: This is in conflict with what we do in RoadClassification, where we have code that is explicit for sidewalks
  if tags.footway == 'sidewalk'
      or tags.steps == 'sidewalk' then
    return
  end
  if tags.footway == 'crossing' and tags.bicycle ~= 'yes' then
    return
  end

  local results = {}
  MergeTable(results, RoadClassification(object))
  MergeTable(results, Lit(object))
  MergeTable(results, Bikelanes(object))
  MergeTable(results, SurfaceQuality(object))
  if not PathClasses[tags.highway] then
    MergeTable(results, Maxspeed(object))
  end

  roadsTable:insert({
    tags = results,
    meta = Metadata(object),
    geom = object:as_linestring()
  })
end
