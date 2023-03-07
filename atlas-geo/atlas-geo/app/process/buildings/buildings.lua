package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("MergeArray")
require("Metadata")
require("InferAddress")

local table = osm2pgsql.define_table({
  name = 'buildings',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})

local function ExitProcessing(object)
  if not object.tags.building then
    return true
  end

  -- Docs: https://wiki.openstreetmap.org/wiki/Key:buildings
  -- local allowed_values = Set({
  --   "city",
  -- })
  -- if not allowed_values[object.tags.place] then
  --   return true
  -- end

  return false
end

local function processTags(tags)
  local allowed_tags = Set({ "building", AddressKeys })
  FilterTags(tags, allowed_tags)
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  processTags(object.tags)
  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
end
