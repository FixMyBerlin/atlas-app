package.path = package.path .. ";/processing/topics/helper/?.lua"
require("DefaultId")
require("sanitize_for_logging")

local db_table = osm2pgsql.define_table({
  name = 'parking_errors',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',   type = 'text', not_null = true },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' }, -- default projection for vector tiles
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = {'minzoom', 'geom'}, method = 'gist' },
    { column = 'id', method = 'btree', unique = true  }
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
    id = DefaultId(object),
    geom = geom,
    tags = tags,
    meta = {},
    minzoom = 0
  }
  db_table:insert(row)
end
