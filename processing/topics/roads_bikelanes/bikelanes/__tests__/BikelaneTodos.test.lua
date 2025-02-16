package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/?.lua"
require("osm2pgsql")
require("TableSize")
require("TableIncludes")
require("Bikelanes")
local inspect = require('inspect')

describe("BikelaneTodos", function()
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
      assert.are.equal(TableIncludes(result[1]._todo_list, "missing_access_tag_240"), false)
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
      assert.are.equal(TableIncludes(result[1]._todo_list, "currentness_too_old"), false)
    end)
  end)

  describe('`advisory_or_exclusive`:', function()
    it('creates only one task for cycleway:both', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:both"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 2)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/left")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), false)

      local right = cycleways[2]
      assert.are.equal(right._id, "way/1/cycleway/right")
      assert.are.equal(TableIncludes(right._todo_list, "advisory_or_exclusive"), true)
        end)

    it('creates only one task for cycleway', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 2)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/left")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), false)

      local right = cycleways[2]
      assert.are.equal(right._id, "way/1/cycleway/right")
      assert.are.equal(TableIncludes(right._todo_list, "advisory_or_exclusive"), true)
    end)

    it('creates only one task for cycleway:left + cycleway:right', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:left"] = 'lane',
          ["cycleway:right"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 2)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/left")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), false)

      local right = cycleways[2]
      assert.are.equal(right._id, "way/1/cycleway/right")
      assert.are.equal(TableIncludes(right._todo_list, "advisory_or_exclusive"), true)
    end)

    it('creates one task for cycleway:left', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:left"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 1)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/left")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), true)
    end)

    it('creates one task for cycleway:left + track', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:left"] = 'lane',
          ["cycleway:right"] = 'track',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 2)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/left")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), true)
    end)

    it('creates one task for cycleway:right', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:right"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 1)

      local left = cycleways[1]
      assert.are.equal(left._id, "way/1/cycleway/right")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), true)
    end)

    it('creates one task for cycleway:right + track', function()
      local input_object = {
        tags = {
          ["highway"] = 'secondary',
          ["cycleway:left"] = 'track',
          ["cycleway:right"] = 'lane',
        },
        id = 1,
        type = 'way'
      }
      local cycleways = Bikelanes(input_object)
      assert.are.equal(TableSize(cycleways), 2)

      local left = cycleways[2]
      assert.are.equal(left._id, "way/1/cycleway/right")
      assert.are.equal(TableIncludes(left._todo_list, "advisory_or_exclusive"), true)
    end)
  end)
end)
