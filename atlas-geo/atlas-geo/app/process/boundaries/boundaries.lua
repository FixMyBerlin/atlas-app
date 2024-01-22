package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("CopyTags")

local table = osm2pgsql.define_table({
  name = 'boundaries',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
  }
})

local tableLabel = osm2pgsql.define_table({
  name = 'boundariesLabel',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local statsTable = osm2pgsql.define_table({
  name = 'boundaryStats',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',                type = 'jsonb' },
    { column = 'meta',                type = 'jsonb' },
    { column = 'bikelane_categories', type = 'jsonb',       create_only = true },
    { column = 'geom',                type = 'multipolygon' },
  }
})

function osm2pgsql.process_relation(object)
  local tags = object.tags
  if not (tags.type == 'boundary' and tags.boundary == "administrative") then
    return
  end

  local allowed_tags = Set({ "name", "name:prefix", "admin_level", "de:regionalschluessel", "population",
    "population:date", "wikidata", "wikipedia" })
  FilterTags(tags, allowed_tags)

  -- Make sure we only include boundaries with a geometry
  -- https://osm2pgsql.org/doc/manual.html#processing-callbacks
  -- https://osm2pgsql.org/doc/manual.html#geometry-objects-in-lua
  if object:as_multipolygon():is_null() then return end

  table:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
  tableLabel:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })

  local admin_levels = Set({ "4", "6", "7", "8" })
  if admin_levels[tags.admin_level] then
    local tags_cc = { "name", "admin_level", "name:prefix", "de:regionalschluessel" }
    tags          = CopyTags({}, tags, tags_cc, "osm_")
    statsTable:insert({
      tags = tags,
      meta = Metadata(object),
      geom = object:as_multipolygon()
    })
  end
end
