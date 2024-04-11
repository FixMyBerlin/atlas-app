package.path = package.path .. ";/processing/topics/helper/?.lua"
local dir = ";/processing/topics/roads_bikelanes/"
package.path = package.path .. dir .. "roads/?.lua"
package.path = package.path .. dir .. "maxspeed/?.lua"
package.path = package.path .. dir .. "surfaceQuality/?.lua"
package.path = package.path .. dir .. "lit/?.lua"
package.path = package.path .. dir .. "bikelanes/?.lua"
package.path = package.path .. dir .. "bikelanes/categories/?.lua"
package.path = package.path .. dir .. "bikeroutes/?.lua"
require("Set")
require("JoinSets")
require("Metadata")
require("ExcludeHighways")
require("ExcludeByWidth")
require("ConvertCyclewayOppositeSchema")
require("Maxspeed")
require("Lit")
require("RoadClassification")
require("RoadGeneralisation")
require("SurfaceQuality")
require("Bikelanes")
require("BikelanesPresence")
require("MergeTable")
require("CopyTags")
require("IsSidepath")
require("ExtractPublicTags")
require("Round")

local roadsTable = osm2pgsql.define_table({
  name = 'roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'minzoom', type = 'integer' },
  }
})

local roadsPathClassesTable = osm2pgsql.define_table({
  name = 'roadsPathClasses',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local bikelanesTable = osm2pgsql.define_table({
  name = 'bikelanes',
  -- Note: We populate a custom `osm_id` (with unique ID values) below.
  ids = { type = 'any', id_column = 'internal_id', type_column = 'osm_type' },
  columns = {
    { column = 'osm_id', type = 'text',      not_null = true },
    { column = 'tags',   type = 'jsonb' },
    { column = 'meta',   type = 'jsonb' },
    { column = 'geom',   type = 'linestring' },
    { column = 'minzoom', type = 'integer' },
  },
  indexes = { { column = 'osm_id', method = 'gist' } }
})

function osm2pgsql.process_way(object)
  local tags = object.tags

  -- ====== (A) Filter-Guards ======
  if not tags.highway then return end

  -- Skip stuff like "construction", "proposed", "platform" (Haltestellen), "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  if not allowed_highways[tags.highway] then return end

  local exclude, _ = ExcludeHighways(tags)
  if exclude then return end
  if object.tags.area == 'yes' then return end

  -- TODO: Rething this. We should only exclude crossing which are not bikelane-crossings. See categories#crossing
  -- if tags.footway == 'crossing' and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
  --   return
  -- end

  -- ====== (B) General conversions ======
  ConvertCyclewayOppositeSchema(tags)
  -- Calculate and format length, see also https://github.com/osm2pgsql-dev/osm2pgsql/discussions/1756#discussioncomment-3614364
  -- Use https://epsg.io/25833 (same as `boundaryStats.sql`); update `atlas_roads--length--tooltip` if changed.
  local length = Round(object:as_linestring():transform(25833):length(), 2)
  -- ====== (C) Compute results and insert ======
  local results = {
    name = tags.name or tags.ref or tags['is_sidepath:of:name'],
    length = length,
  }

  MergeTable(results, RoadClassification(object))
  MergeTable(results, Lit(object))
  MergeTable(results, SurfaceQuality(object))

  local cycleways = Bikelanes(object)
  for _, cycleway in ipairs(cycleways) do
    if cycleway._infrastructureExists then
      local publicTags = ExtractPublicTags(cycleway)
      publicTags.name = results.name
      publicTags.length = length
      publicTags.road = results.road
      publicTags.prefix = cycleway._prefix
      publicTags._parent_highway = cycleway._parent_highway

      cycleway.segregated = nil            -- no idea why that is present in the inspector frontend for way 9717355
      bikelanesTable:insert({
        osm_id = cycleway._id,
        tags = publicTags,
        meta = Metadata(object),
        geom = object:as_linestring(),
        minzoom = 0
      })
    end
  end

  if not (PathClasses[tags.highway] or tags.highway == 'pedestrian') then
    MergeTable(results, Maxspeed(object))
  end
  MergeTable(results, BikelanesPresence(object, cycleways))

  -- We need sidewalk for Biklanes(), but not for `roads`
  if not IsSidepath(tags) then
    if PathClasses[tags.highway] then
      roadsPathClassesTable:insert({
        tags = results,
        meta = Metadata(object),
        geom = object:as_linestring()
      })
    else

      roadsTable:insert({
        tags = results,
        meta = Metadata(object),
        geom = object:as_linestring(),
        minzoom = RoadGeneralisation(tags, results)
      })
    end
  end
end
