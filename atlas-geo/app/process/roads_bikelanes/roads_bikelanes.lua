package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
local dir = ";/app/process/roads_bikelanes/"
package.path = package.path .. dir .. "roadClassification/?.lua"
package.path = package.path .. dir .. "maxspeed/?.lua"
package.path = package.path .. dir .. "surfaceQuality/?.lua"
package.path = package.path .. dir .. "lit/?.lua"
package.path = package.path .. dir .. "bikelanes/?.lua"
package.path = package.path .. dir .. "bikeroutes/?.lua"

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
require("Bikeroutes")
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

local bikeroutesTable = osm2pgsql.define_table({
  name = 'bikeroutes',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multilinestring' },
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

-- local wayRouteMapping = {}

function osm2pgsql.process_way(object)
  local tags = object.tags

  -- ====== (A) Filter-Guards ======
  if not tags.highway then return end

  -- Skip stuff like "construction", "proposed", "platform" (Haltestellen), "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
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

  -- TODO: Rething this. We should only exclude crossing which are not bikelane-crossings. See categories#crossing
  -- if tags.footway == 'crossing' and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
  --   return
  -- end

  -- ====== (B) General conversions ======
  ConvertCyclewayOppositeSchema(tags)

  -- ====== (C) Compute results and insert ======
  local results = {
    name = tags.name or tags.ref or tags['is_sidepath:of:name']
  }

  MergeTable(results, RoadClassification(object))
  MergeTable(results, Lit(object))
  MergeTable(results, SurfaceQuality(object))


  local cycleways = Bikelanes(object)
  for _, cycleway in pairs(cycleways) do
    if cycleway._infrastructureExists then
      cycleway.name = results.name
      cycleway.road = results.road

      -- if osm2pgsql.stage == 2 then
      --   cycleway.routes = '[' .. table.concat(wayRouteMapping[object.id], ',') .. ']'
      -- end

      bikelanesTable:insert({
        tags = cycleway,
        meta = Metadata(object),
        geom = object:as_linestring()
      })
    end
  end

  if not PathClasses[tags.highway] then
    MergeTable(results, Maxspeed(object))
    MergeTable(results, BikelanesPresence(object, cycleways))
  end

  -- We need sidewalk for Biklanes(), but not for `roads`
  local isSidewalk = tags.footway == 'sidewalk' or tags.steps == 'sidewalk'
  if not isSidewalk then
    roadsTable:insert({
      tags = results,
      meta = Metadata(object),
      geom = object:as_linestring()
    })
  end
end

function osm2pgsql.process_relation(object)
  if IsBicycleRoute(object.tags) then
    -- UpdateWayRouteMapping(wayRouteMapping, object.id, osm2pgsql.way_member_ids(object))

    bikeroutesTable:insert({
      tags = Bikeroutes(object.tags),
      meta = Metadata(object),
      geom = object:as_multilinestring(),
    })
  end
end

-- function osm2pgsql.select_relation_members(object)
--   if IsBicycleRoute(object.tags) then
--     return { ways = osm2pgsql.way_member_ids(object) }
--   end
-- end
