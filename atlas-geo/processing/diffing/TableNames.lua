-- This file mocks the osm2pgsql library.
-- We use this to extract the table names from *.lua files, which we use to compute diffs.
local function define_x_table(name, _)
  if not name:match("^_") then -- don't expose tables that start with "_"
    print(name)
end
end
osm2pgsql = {
  define_table = function(options) define_x_table(options.name) end,
  define_node_table = define_x_table,
  define_way_table = define_x_table,
  define_relation_table = define_x_table,
  define_area_table = define_x_table
}


local topic = arg[1]
package.path = package.path .. ";/processing/topics/" .. topic .. "/?.lua"
require(topic)
