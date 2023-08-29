package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("Metadata")

local table = osm2pgsql.define_table({
  name = 'boundaries',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})

function osm2pgsql.process_relation(object)
  if not (object.tags.type == 'boundary' and object.tags.boundary == "administrative") then
    return
  end

  local allowed_tags = Set({ "name", "name:prefix", "admin_level", "de:regionalschluessel", "population",
    "population:date", "wikidata", "wikipedia" })
  FilterTags(object.tags, allowed_tags)

  -- Make sure we only include boundaries with a geometry
  -- https://osm2pgsql.org/doc/manual.html#processing-callbacks
  -- https://osm2pgsql.org/doc/manual.html#geometry-objects-in-lua
  if object:as_multipolygon():is_null() then return end

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
end
