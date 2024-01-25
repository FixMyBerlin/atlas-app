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
require("BikelanesPresence")
require("MergeTable")
require("CopyTags")

local roadsTable = osm2pgsql.define_table({
  name = 'roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local bikelanesTable = osm2pgsql.define_table({
  name = '_bikelanes_temp',
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

  -- ====== Filter-Guards ======
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

  -- Keep in line with categories.lua crossing()
  if tags.footway == 'crossing' and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
    return
  end

  -- ====== General conversions ======
  ConvertCyclewayOppositeSchema(tags)


  -- ====== Handle roads tables ======

  local results = {}

  -- Exlude sidewalks for the road data set
  local is_sidewalk = tags.footway == 'sidewalk' or tags.steps == 'sidewalk'
  if not is_sidewalk then
    MergeTable(results, RoadClassification(object))
    MergeTable(results, Lit(object))
    MergeTable(results, SurfaceQuality(object))
  end

  local cycleways = Bikelanes(object, results.road)
  for _, cycleway in pairs(cycleways) do
    if cycleway._infrastructureExists then
      -- We don't want to insert negative data into the bikelanes table
      -- e.g. cycleway=no but we need these for BikelanesPresence
      bikelanesTable:insert({
        tags = tags.cycleway,
        meta = Metadata(object),
        geom = object:as_linestring()
      })
    end
  end

  if not PathClasses[tags.highway] then
    MergeTable(results, Maxspeed(object))
    MergeTable(results, BikelanesPresence(object, cycleways))
  end


  local allowed_tags = {
    'name',
  }
  CopyTags(results, tags, allowed_tags)

  roadsTable:insert({
    tags = results,
    meta = Metadata(object),
    geom = object:as_linestring()
  })

end
