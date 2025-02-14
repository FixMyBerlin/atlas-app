-- Helper function to check if a value is in a table
local function tableIncludes(tbl, value)
  for _, v in ipairs(tbl) do
    if v == value then
      return true
    end
  end
  return false
end

describe("BikelaneTodos", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/?.lua"
  require("osm2pgsql")
  require("Bikelanes")
  local inspect = require('inspect')

  describe('`missing_access_tag_240`:', function()
    it('`cycleway=track` does not show up in category', function()
      local input_object = {
        tags = {
          ["highway"] = 'tertiary',
          ["cycleway:left"] = 'track',
          ["cycleway:left:traffic_sign"] = 'DE:240',
        },
        id = 1,
        type = 'way'
      }
      local result = Bikelanes(input_object)
      assert.are.equal(tableIncludes(result[1]._todo_list, "missing_access_tag_240"), false)
    end)
  end)

  describe('`currentness_too_old`:', function()
    it('15 year old way shows up in category', function()
      local input_object = {
        tags = {
          ["highway"] = 'cycleway',
        },
        meta = {
          ["updated_age"] = 5475,
        },
        id = 1,
        type = 'way'
      }
      local result = Bikelanes(input_object)
      assert.are.equal(tableIncludes(result[1]._todo_list, "currentness_too_old"), false)
    end)
  end)
end)
