package.path = package.path .. ";/processing/topics/helper/?.lua"
require("DefaultId")
require("sanitize_for_logging")

local db_table = osm2pgsql.define_table({
  name = 'parking_errors',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    -- We might have to change the way we handle unique IDs here.
    -- But for now we add the `caller_name` to the ID.
    -- https://osm2pgsql.org/doc/manual-v1.html#using-an-additional-id-column
    -- { column = 'serial_id', sql_type = 'serial', create_only = true },
    { column = 'id',   type = 'text', not_null = true },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' }, -- default projection for vector tiles
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = {'minzoom', 'geom'}, method = 'gist' },
    -- { column = 'serial_id', method = 'btree', unique = false  },
    -- { column = 'id', method = 'btree', unique = false  },
    { column = 'id', method = 'btree', unique = true  },
  }
})

-- Called right before other tables are inserted.
-- Handles point, line and area data but stores them as points (centroid)
-- `tags` are based on sanitize_for_logging.lua and sanitize_cleaner.lua
function parking_errors(object, tags, caller_name)
  if next(tags) == nil then return end

  local geom = nil
  if(object.type == "node") then geom = object:as_point() end
  if(object.type == "way") then geom = object:as_multilinestring():centroid() end
  if(object.type == "relation") then geom = object:as_multilinestring():centroid() end

  tags._caller_name = caller_name
  tags._instruction = "These tags have values that were not accepted by our sanitization. Please review the values, fix the data, or update the sanitization."
  local row = {
    id = DefaultId(object) .. "/" .. caller_name,
    geom = geom,
    tags = tags,
    meta = {},
    minzoom = 0
  }
  db_table:insert(row)
end
