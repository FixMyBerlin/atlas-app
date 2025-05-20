require('init')
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

  local row_tags = result_tags_roads(object)
  local cleaned_tags, replaced_tags = sanitize_cleaner(row_tags.tags, object)
  row_tags.tags = cleaned_tags
  parking_errors(object, replaced_tags, 'parking_roads')

  local is_parking = is_parking(object.tags)
  local row = MergeTable({ geom = object:as_linestring(), is_driveway = is_driveway, is_parking = is_parking }, row_tags)
  db_table:insert(row)
end
