describe("`parking_obstacle_points`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("osm2pgsql")
  require("parking_obstacle_points")
  local inspect = require('inspect')

  -- This kind of tests does not work because we need to pass in some geometry part to "object" so the object::as_point() part works
  --
  -- it('works', function()
  --   local object = {
  --     ["id"] = "1",
  --     ["type"] = "node",
  --     ["tags"] = {
  --       ["natural"] = 'tree',
  --       ["obstacle:parking"] = 'yes',
  --       ["ref"] = '1',
  --     },
  --   }
  --   local result = parking_obstacle_points(object)
  --   assert.are.equal(result, nil)
  -- end)

end)
