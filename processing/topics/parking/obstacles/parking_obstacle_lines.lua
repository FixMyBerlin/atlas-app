package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/line/?.lua"
require("Log")
require("MergeTable")
require("categorize_line")
require("result_tags_obstacles")


local db_table = osm2pgsql.define_table({
  name = '_parking_obstacle_lines',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'id',      type = 'text',      not_null = true },
    { column = 'tags',    type = 'jsonb' },
    { column = 'meta',    type = 'jsonb' },
    { column = 'geom',    type = 'linestring', projection = 5243 },
  },
})


function parking_obstacle_lines(object)
  if object.is_closed then return end
  if next(object.tags) == nil then return end

  local result = categorize_line(object)
  if result.object then
    local row = MergeTable({ geom = result.object:as_linestring() }, result_tags_obstacles(result))
    db_table:insert(row)
  end

end
