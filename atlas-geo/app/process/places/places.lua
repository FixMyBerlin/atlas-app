package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("Metadata")
require("CopyTags")

local table = osm2pgsql.define_table({
  name = 'places',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local function ExitProcessing(object)
  if not object.tags.place then
    return true
  end

  -- Docs: https://wiki.openstreetmap.org/wiki/Key:place
  local allowed_values = Set({
    "city",
    "borough",
    "suburb",
    "town",
    "village",
    "hamlet"
  })
  if not allowed_values[object.tags.place] then
    return true
  end

  return false
end

local function processTags(tags)
  local tags_cc = Set({ "name", "place", "capital", "website", "wikidata", "wikipedia", "population",
    "population:date", "admin_level" })
  tags.population = tonumber(tags.population)
  return CopyTags({}, tags, tags_cc)
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
