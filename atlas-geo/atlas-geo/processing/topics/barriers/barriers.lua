package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Set")
require("Metadata")
require("HighwayClasses")
require("CopyTags")

local lineBarriers = osm2pgsql.define_table({
  name = 'barrierLines',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'minzoom', type = 'integer' },
  }
})

local areaBarriers = osm2pgsql.define_table({
  name = 'barrierAreas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
    { column = 'minzoom', type = 'integer' },
  }
})

local tags_cc = {
  'tunnel',
  'waterway',
  'aerodrome',
  'name',
  'natural',
  'railway',
  'usage',
  'circumference',
  'area',
  'highway',
  'bridge',
}

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
      areaBarriers:insert({
        tags = CopyTags({}, object.tags, tags_cc),
        meta = Metadata(object),
        geom = object:as_multipolygon(),
        minzoom = 0
      })
      return
    end
  else --process as linestring
    local tags = object.tags
    local isBarrier = HighwayClasses[tags.highway]

    -- waterways as lines are used for low zoom levels
    local waterBarriers = Set({ "river", "canal" })
    isBarrier = isBarrier or waterBarriers[tags.waterway]

    local trainBarriers = Set({ "main", "branch" })
    if (tags.railway == 'rail' or tags.railway == 'light_rail') then
      isBarrier = isBarrier or trainBarriers[tags.usage]
    end

    if isBarrier then
      lineBarriers:insert({
        tags = CopyTags({}, object.tags, tags_cc),
        meta = Metadata(object),
        geom = object:as_linestring(),
        minzoom = 0
      })
      return
    end
  end
end

function osm2pgsql.process_relation(object)
  if isAreaBarrier(object) then
    areaBarriers:insert({
      tags = CopyTags({}, object.tags, tags_cc),
      meta = Metadata(object),
      geom = object:as_multipolygon(),
      minzoom = 0
    })
    return
  end
end
