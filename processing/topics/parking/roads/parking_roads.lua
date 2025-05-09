package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_roads")
require("exit_processing_service_roads")

local db_table = osm2pgsql.define_table({
  name = '_parking_roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
    { column = 'is_service', type = 'boolean'},
    { column = 'minzoom', type = 'integer' },
  },
  indexes = {
    { column = { 'osm_id' }, method = 'btree' },
    { column = { 'minzoom', 'geom' }, method = 'gist' },
  }
})

function parking_roads(object)
  local exit_road = exit_processing_roads(object.tags)
  local exit_service_road = exit_processing_service_roads(object.tags)
  if exit_road and exit_service_road then return end

  local row = MergeTable({ geom = object:as_linestring(), is_service = not exit_service_road}, result_tags_roads(object))
  db_table:insert(row)
end
