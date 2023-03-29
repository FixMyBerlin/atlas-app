local srid = 4326

-- TODO: This is the only table that does not use jsonb to store the tags.
-- Which means it breaks when we try to use our export script.
-- It also lacks a jsonb meta column.
-- See also db_configuration.py.

local table = osm2pgsql.define_area_table('boundaries', {
  { column = 'id',          sql_type = 'serial', create_only = true },
  { column = 'name',        type = 'text' },
  { column = 'admin_level', sql_type = 'numeric' },
  { column = 'geom',        type = 'geometry',   projection = srid },
  { column = 'area',        type = 'area' },
})

function osm2pgsql.process_relation(object)
  if object.tags.type == 'boundary' and
      object.tags.boundary == "administrative" then
    table:add_row {
      name = object.tags["name"],
      admin_level = object.tags["admin_level"],
      geom = { create = "area" }
    }
  end
end
