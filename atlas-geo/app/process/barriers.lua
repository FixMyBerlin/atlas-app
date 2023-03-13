-- Goal:
-- ======
-- Data on things that would prevent a bike network like water, highways, airports

-- TODOs:
-- ======
-- LUA https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/poiBarriers/downloadPoiBarriers.ts
-- Remove small lakes. So closed ways that are of a certain area (LUA area function should work)
-- Cleanup tags and add custom category for easy visualization

package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")

local table = osm2pgsql.define_table({
  name = 'barriers',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local function isBarrier(object)
  local tags = object.tags
  local waterBarriers = Set({"river", "canal"})
  local trainBarriers = Set({"main", "branch"})
  if tags.tunnel ~='yes' and (
    HighwayClasses[tags.highway]
    or waterBarriers[tags.waterway]
    or (tags.railway == 'rail' and trainBarriers[tags.usage]))
    or (tags.natural == 'water') then
      --todo add length filter after we update osm2pgsql
      return true
  end
  return false
end

function osm2pgsql.process_way(object)
  if isBarrier(object) then
    -- TODO: filter tags
    table:insert({
      tags = object.tags,
      meta=Metadata(object),
      geom=object:as_linestring()
    })
  end
end

-- function osm2pgsql.process_relation(object)
--   if isBarrier(object.tags) then
--     -- TODO: filter tags
--     table:insert({
--       tags = object.tags,
--       meta=Metadata(object),
--       geom=object:as_linestring()
--     })
--   end
-- end
