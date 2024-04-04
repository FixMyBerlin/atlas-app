-- This file mocks the osm2pgsql library when called from lua directly.
-- We use this to extract the table names from *.lua files, which get used to create diffs.

if osm2pgsql == nil then
  local function define_x_table(name, _)
    if not name:match("^_") then -- don't diff tables that start with "_"
      print(name)
  end
  end
  osm2pgsql = {
    define_table = function(options) define_x_table(options.name) end,
    define_node_table = define_x_table,
    define_way_table = define_x_table,
    define_relation_table = define_x_table
  }
end
