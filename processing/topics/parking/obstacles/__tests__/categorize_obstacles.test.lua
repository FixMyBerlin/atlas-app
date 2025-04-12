describe("`categorize_obstacles`", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
  require("osm2pgsql")
  require("categorize_obstacles")
  require("obstacle_point_categories")
  local inspect = require('inspect')

  it('regular trees are ignored', function()
    local tags = {
      ["natural"] = 'tree',
      ["ref"] = '1',
    }
    local category = categorize_obstacles(tags, obstacle_point_categories)
    assert.are.equal(category, nil)
  end)

  it('obstacle trees are processed', function()
    local tags = {
      ["natural"] = 'tree',
      ["obstacle:parking"] = 'yes',
      ["ref"] = '1',
    }
    local category = categorize_obstacles(tags, obstacle_point_categories)
    assert.are.equal(category.source, 'natural=tree')
    assert.are.equal(inspect(category.further_tags), '{ "ref" }')
    assert.are.equal(category.perform_buffer, 1.5)
    assert.are.equal(category.side, "self")
    assert.are.equal(category.perform_move, false)
  end)
end)
