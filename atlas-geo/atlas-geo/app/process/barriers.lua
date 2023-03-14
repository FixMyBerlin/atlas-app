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

local lineBarriers = osm2pgsql.define_table({
  name = 'lineBarriers',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local areaBarriers = osm2pgsql.define_table({
  name = 'areaBarriers',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})

function isBarrier(object)
  local tags = object.tags
  if tags.tunnel =='yes' then return end -- we don't consider tunnels as barriers

  local isBarrier = HighwayClasses[tags.highway]


  local waterBarriers = Set({"river", "canal"})
  isBarrier = isBarrier or waterBarriers[tags.waterway]

  local trainBarriers = Set({"main", "branch"})
  isBarrier = isBarrier or (tags.railway == 'rail' and trainBarriers[tags.usage])

  isBarrier = isBarrier or tags.aeroway=='aerodrome'

  local isWater = tags.natural == 'water'
  if tags.natural == 'water' then
    if object.type == 'relation' or tags.area =='yes' or tags.closed == 'yes' then
      local area = object:as_multipolygon():transform(3857):area()
      isBarrier = isBarrier or area > 1000
      print(area)
      print(object.type)
      print(object.id)
    else
      local coastLength = object:as_linestring():transform(3857):length()
      isBarrier = isBarrier or coastLength > 1000
      -- print('found water way')
    end
  end
  return isBarrier
end

function osm2pgsql.process_way(object)
  if isBarrier(object) then
    -- TODO: filter tags
    lineBarriers:insert({
      tags = object.tags,
      meta=Metadata(object),
      geom=object:as_linestring(),
    })
  end
end

function osm2pgsql.process_relation(object)
  if object.tags.natural == 'water' then
    print(object:as_multipolygon():transform(3857):area())
  end
  if isBarrier(object) then
    -- TODO: filter tags
    areaBarriers:insert({
      tags = object.tags,
      meta=Metadata(object),
      geom=object:as_multipolygon()
    })
  end
end
