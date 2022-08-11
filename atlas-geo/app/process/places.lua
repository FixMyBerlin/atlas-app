package.path = package.path .. ";/app/process/helper/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddMetadata")
require("AddUrl")

local table = osm2pgsql.define_node_table('places', {
  { column = 'tags', type = 'jsonb' },
  { column = 'geom', type = 'point' },
  -- See https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/attributes.lua#L18-L21
  -- There is no built-in type for timestamps in osm2pgsql. So we use the
  -- PostgreSQL type "timestamp" and then have to convert our timestamps
  -- to a valid text representation for that type.
  { column = 'updated_by', type = 'text' },
  { column = 'update_at', sql_type = 'timestamp' },
  -- 'version', 'user' see https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/attributes.lua
  { column = 'version', type = 'int' },
})

-- TODO: Diese Seite sollten wir umbauen analog zu "shopping", so dass node, way, relations prozessiert werden als Nodes
-- Dann müssen wir ggf. noch duplikate entfernen…
function osm2pgsql.process_node(object)
  if not object.tags.place then
    return
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
    return
  end

  local allowed_tags = Set({
    "node_id", "name", "place", "capital", "website", "wikidata", "wikipedia", "population", "population:date",
    "admin_level"
  })
  FilterTags(object.tags, allowed_tags)
  ToNumber(object.tags, Set({ "population" }))
  AddMetadata(object)
  AddUrl('node', object)

  table:add_row({
    tags = object.tags
  })
end
