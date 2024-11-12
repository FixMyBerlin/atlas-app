-- This file mocks the osm2pgsql library.
-- We use this to extract the table names from *.lua files, which we use to compute diffs.

local function validate_columns(columnList)
  -- convert list of columns to dict {columnName: type}
  local columnTable = {}
  for _, column in ipairs(columnList) do
    columnTable[column.column] = column.type
  end

  -- define require columns and types
  local required_columns = {
    id = 'text',
    tags = 'jsonb',
    meta = 'jsonb',
    geom = nil,
    minzoom = 'integer',
  }
  for columnName, columnType in pairs(required_columns) do
    -- validate that required column is present
    if not columnTable[columnName] then
      error('Missing column: ' .. columnName)
    end
    -- validate the column type
    if columnType ~= nil and columnTable[columnName] ~= columnType then
      error('Invalid column type for ' .. columnName .. ': ' .. columnList[columnName])
    end
  end
end

local function define_x_table(name, columns)
  if not name:match("^_") then -- don't expose tables that start with "_"
    validate_columns(columns)
    print(name)
  end
end

osm2pgsql = {
  define_table = function(options) define_x_table(options.name, options.columns) end,
  define_node_table = define_x_table,
  define_way_table = define_x_table,
  define_relation_table = define_x_table,
  define_area_table = define_x_table
}


local topic = arg[1]
package.path = package.path .. ";/processing/topics/" .. topic .. "/?.lua"
require(topic)
