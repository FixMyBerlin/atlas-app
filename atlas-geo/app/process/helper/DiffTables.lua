-- This file mocks the osm2pgsql library when called from lua directly.
-- We use this to extract the table names from *.lua files, which get used to create diffs.
if osm2pgsql == nil then
  local define_x_table = function(name, _) print(name) end
  osm2pgsql = {
    define_table = function(options) print(options.name) end,
    define_node_table = define_x_table,
    define_way_table = define_x_table,
    define_relation_table = define_x_table
  }
end
