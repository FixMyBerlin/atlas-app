package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("is_road")
require("is_driveway")
require("is_parking")

local db_table = osm2pgsql.define_table({
  name = '_parking_roads',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
    { column = 'is_driveway', type = 'boolean'},
    { column = 'is_parking', type = 'boolean'},
  },
  indexes = {
    { column = { 'osm_id' }, method = 'btree' },
    { column = { 'geom' }, method = 'gist' },
  }
})

function parking_roads(object)
  local is_road = is_road(object.tags)
  local is_driveway = is_driveway(object.tags)
  if not (is_road or is_driveway) then return end

  local is_parking = is_parking(object.tags)
  local tags = result_tags_roads(object)
  local row = MergeTable({ geom = object:as_linestring(), is_driveway = is_driveway, is_parking = is_parking }, tags)
  db_table:insert(row)
end
