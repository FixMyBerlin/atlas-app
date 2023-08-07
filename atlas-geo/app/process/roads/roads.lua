package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roadClassification/?.lua;/app/process/maxspeed/?.lua;/app/process/surfaceQuality/?.lua;/app/process/lit/?.lua;/app/process/bikelanes/?.lua"

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
  local exclude, _ = ExcludeByWidth(tags, 2.1)
  if exclude then
    tags.is_narrow = true
  else
    if tags.highway == 'footway' then
      if tags.footway == 'sidewalk' or tags.bicycle =='no' then
       return
      end
    end

    local results = {}
    MergeTable(results, RoadClassification(object))
    MergeTable(results, Lit(object))
    MergeTable(results, Bikelanes(object))
    if not HighwayClasses[tags.highway] then
      -- call surface quality
      MergeTable(results, SurfaceQuality(object))
      if not PathClasses[tags.highway] then
        -- call maxspeed
        MergeTable(results, MaxSpeed(object))
      end
    end
    roadsTable:insert({
      tags = results,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
  end
end
