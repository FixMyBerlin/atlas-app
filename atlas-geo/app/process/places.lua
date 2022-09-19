package.path = package.path .. ";/app/process/helper/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")

local table = osm2pgsql.define_table({
  name = 'places',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
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

local function ProcessTags(object)
  local allowed_tags = Set({ "name", "place", "capital", "website", "wikidata", "wikipedia", "population",
    "population:date", "admin_level" })
  FilterTags(object.tags, allowed_tags)
  ToNumber(object.tags, Set({ "population" }))
  AddMetadata(object)
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  ProcessTags(object)
  AddUrl("node", object)

  table:insert({
    tags = object.tags,
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  ProcessTags(object)
  AddUrl("way", object)

  table:insert({
    tags = object.tags,
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  ProcessTags(object)
  AddUrl("relation", object)

  table:insert({
    tags = object.tags,
    geom = object:as_multipolygon():centroid()
  })
end
