package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
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

local labelTable = osm2pgsql.define_table({
  name = 'boundaryLabels',
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

  local results_tags = {}
  results_tags.admin_level = tonumber(tags.admin_level)
  results_tags.population = tonumber(tags.population)
  -- Categories:
  if (results_tags.admin_level == 8) then
    results_tags.category_municipality = "Gemeinde"
  end
  if (results_tags.admin_level == 6) then
    results_tags.category_district = "Landkreis"
    if (tags.place == "city" or tags["name:prefix"] == "Kreisfreie Stadt") then
      results_tags.category_municipality = "Kreisfreie Stadt"
      results_tags.category_district = "Kreisfreie Stadt"
    end
  end
  if (results_tags.admin_level == 4 and tags.place == "city") then
    results_tags.category_municipality = "Stadtstaat"
    results_tags.category_district = "Stadtstaat"
  end
  -- these tags are copied (Eigennamen)
  local allowed_tags = { "name", "name:prefix" }
  CopyTags(results_tags, tags, allowed_tags)
  -- these tags are copied and prefixed with `osm_`
  local tags_cc = { "de:regionalschluessel", "population:date", "wikidata", "wikipedia" }
  CopyTags(results_tags, tags, tags_cc, "osm_")

  -- Make sure we only include boundaries with a geometry
  -- https://osm2pgsql.org/doc/manual.html#processing-callbacks
  -- https://osm2pgsql.org/doc/manual.html#geometry-objects-in-lua
  if object:as_multipolygon():is_null() then return end

  table:insert({
    tags = results_tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
  labelTable:insert({
    tags = results_tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })

  local admin_levels = Set({ "4", "6", "7", "8" })
  if admin_levels[tags.admin_level] then
    statsTable:insert({
      tags = results_tags,
      meta = Metadata(object),
      geom = object:as_multipolygon()
    })
  end
end
