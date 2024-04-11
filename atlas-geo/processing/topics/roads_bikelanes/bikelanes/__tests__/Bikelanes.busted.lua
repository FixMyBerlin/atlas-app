describe("Bikelanes", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/?.lua"
  require("osm2pgsql")
  require("Bikelanes")

  describe('Handle `width`', function()
    it('handels width on centerline', function()
      local input_object = {
        tags = {
          highway = 'residential',
          width = '5 m',
          bicycle_road = 'yes',
        }
      }
      local result = Bikelanes(input_object)
      assert.are.same(result[1].category, "bicycleRoad")
      assert.are.same(result[1].width, 5)
    end)

    it('handels explicit width on transformed objects', function()
      local input_object = {
        tags = {
          highway = 'residential',
          width = '10 m',
          ['cycleway:left'] = 'track',
          ['cycleway:left:width'] = '5 m',
        }
      }
      local result = Bikelanes(input_object)
      -- Add assertions here
    end)
  end)
end)
