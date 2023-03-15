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

local excludedBarriers = osm2pgsql.define_table({
  name = 'excludedBarriers',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})


function isAreaBarrier(object)
  local tags = object.tags
  if object.type =='way' and not object.is_closed then
    --only process ways iff closed
    return false
  end
  local isBarrier = false

  if tags.natural == 'water' then
    local area = object:as_multipolygon():transform(3857):area()
    tags.area = area
    -- TODO: IMO it would be better to have this check on the single polygons of a multipolygon
    if area > 100000 then
      isBarrier = true
    elseif object.type == 'way' then
      isBarrier = isBarrier or object:as_linestring():transform(3857):length() > 1000
    else
      excludedBarriers:insert({
        tags=object.tags,
        meta=Metadata(object),
        geom=object:as_multipolygon()
      })
    end
    --TODO exclude list
  end

  isBarrier = isBarrier or tags.aeroway == 'aerodrome'

  return isBarrier
end

function osm2pgsql.process_way(object)
  -- isBarrier = isBarrier or tags.aeroway=='aerodrome'
  if isAreaBarrier(object) then
  areaBarriers:insert({
    tags = object.tags,
    meta=Metadata(object),
    geom=object:as_multipolygon()
  })
  else
    local tags = object.tags
    if tags.tunnel =='yes' then return end -- we don't consider tunnels as barriers

    local isBarrier = HighwayClasses[tags.highway]

    -- we shouldn't need these as every waterway should have a feature describing its area
    -- local waterBarriers = Set({"river", "canal"})
    -- isBarrier = isBarrier or waterBarriers[tags.waterway]

    local trainBarriers = Set({"main", "branch"})
    isBarrier = isBarrier or (tags.railway == 'rail' and trainBarriers[tags.usage])
    if tags.natural == 'water' then
      local coastLength = object:as_linestring():transform(3857):length()
      isBarrier = isBarrier or coastLength > 1000
    end
    if isBarrier then
      -- TODO: filter tags
      lineBarriers:insert({
        tags = object.tags,
        meta=Metadata(object),
        geom=object:as_linestring(),
      })
    end
  end
end

function osm2pgsql.process_relation(object)
  if isAreaBarrier(object) then
    -- TODO: filter tags
    areaBarriers:insert({
      tags = object.tags,
      meta=Metadata(object),
      geom=object:as_multipolygon()
    })
  end
end
