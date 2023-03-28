package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")

local lineBarriers = osm2pgsql.define_table({
  name = 'barrierLines,
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local excludedLineBarriers = osm2pgsql.define_table({
  name = 'barrierLines_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local areaBarriers = osm2pgsql.define_table({
  name = 'barrierAreas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})

local excludedAreaBarriers = osm2pgsql.define_table({
  name = 'barrierAreas_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})


local allowedTags = Set({
  'tunnel',
  'waterway',
  'aerodrome',
  'name',
  'natural',
  'railway',
  'usage',
  'circumference',
  'area',
})

local function isAreaBarrier(object)
  local tags = object.tags
  local isBarrier = false

  if tags.natural == 'water' then
    local area = object:as_multipolygon():transform(3857):area()
    tags.area = area
    -- TODO: IMO it would be better to have this check on the single polygons of a multipolygon
    if area > 100000 then
      isBarrier = true
      tags.area = area
    elseif object.type == 'way' then
      local circumference = object:as_linestring():transform(3857):length()
      tags.circumference = circumference
      if circumference > 1000 then
        isBarrier = isBarrier or (area / circumference) < 3
        isBarrier = true
      end
    end
  end

  isBarrier = isBarrier or tags.aeroway == 'aerodrome'

  return isBarrier
end

function osm2pgsql.process_way(object)
  if object.is_closed then -- process as polygon
    if isAreaBarrier(object) then
      FilterTags(object.tags, allowedTags)
      areaBarriers:insert({
        tags = object.tags,
        meta=Metadata(object),
        geom=object:as_multipolygon()
      })
      return
    end
    excludedAreaBarriers:insert({
      tags=object.tags,
      meta=Metadata(object),
      geom=object:as_multipolygon()
    })
    return
  else --process as linestring
    local tags = object.tags
    -- if tags.tunnel =='yes' then return end -- we don't consider tunnels as barriers

    local isBarrier = HighwayClasses[tags.highway]

    -- only need for low zoom levels
    local waterBarriers = Set({"river", "canal"})
    isBarrier = isBarrier or waterBarriers[tags.waterway]

    local trainBarriers = Set({"main", "branch"})
    if (tags.railway == 'rail' or tags.railway == 'lightrail') then
      isBarrier = isBarrier or trainBarriers[tags.usage]
    end
    if isBarrier then
      FilterTags(object.tags, allowedTags)
      lineBarriers:insert({
        tags = object.tags,
        meta=Metadata(object),
        geom=object:as_linestring(),
      })
      return
    end
    excludedLineBarriers:insert({
      tags=object.tags,
      meta=Metadata(object),
      geom=object:as_linestring()
    })
  end
end

function osm2pgsql.process_relation(object)
  if isAreaBarrier(object) then
    FilterTags(object.tags, allowedTags)
    areaBarriers:insert({
      tags = object.tags,
      meta=Metadata(object),
      geom=object:as_multipolygon()
    })
    return
  end
  excludedAreaBarriers:insert({
    tags=object.tags,
    meta=Metadata(object),
    geom=object:as_multipolygon()
  })
end
