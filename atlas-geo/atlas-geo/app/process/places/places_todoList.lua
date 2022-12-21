package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("MergeArray")
require("Metadata")


local table = osm2pgsql.define_table({
  name = 'places_todoList',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local function ContinueProcess(object)
  -- Docs: https://wiki.openstreetmap.org/wiki/Key:place
  local allowed_values = Set({
    "city",
    "borough",
    "suburb",
    "town",
    "village",
    "hamlet"
  })
  if object.tags.place and allowed_values[object.tags.place] then
    local continue = false
    object.tags._todos = ""

    -- Add task to add *population* data.
    if not object.tags.population then
      continue = true
      object.tags._todos = object.tags._todos .. ";TODO add `population`-Tag."
    end

    -- Add task to add *population:date* data.
    -- TODO: Ideally, we would look at the data, but we need to parse that first…
    if not object.tags["population:date"] then
      continue = true
      object.tags._todos = object.tags._todos .. ";TODO add `population:date`-Tag."
    end

    return continue
  end

  return false
end

local function processTags(tags)
  local allowed_tags = Set({ "_todos", "name", "place", "capital", "website", "wikidata", "wikipedia", "population",
    "population:date", "admin_level" })
  FilterTags(tags, allowed_tags)
  -- ToNumber(object.tags, Set({ "population" }))
end

function osm2pgsql.process_node(object)
  if not ContinueProcess(object) then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if not ContinueProcess(object) then return end
  if not object.is_closed then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if not ContinueProcess(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
