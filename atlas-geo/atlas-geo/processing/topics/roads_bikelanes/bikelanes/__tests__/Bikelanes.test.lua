describe("Bikelanes", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/?.lua"
  require("osm2pgsql")
  require("Bikelanes")

  describe('Handle `width`:', function()
    it('handels width on centerline', function()
      local input_object = {
        tags = {
          highway = 'residential',
          width = '5 m',
          bicycle_road = 'yes',
        },
        id = 1,
        type = 'way'
      }
      local result = Bikelanes(input_object)
      assert.are.equal(result[1].category, "bicycleRoad")
      assert.are.equal(result[1].width, 5)
    end)

    it('handels explicit width on transformed objects', function()
      local input_object = {
        tags = {
          highway = 'residential',
          width = '10 m',
          ['cycleway:left'] = 'track',
          ['cycleway:left:width'] = '5 m',
        },
        id = 1,
        type = 'way'
      }
      local result = Bikelanes(input_object)
      assert.are.equal(result[1].category, "cycleway_adjoining")
      assert.are.equal(result[1].width, 5)
    end)

    it('handels nested width on paths', function()
      local input_object = {
        tags = {
          highway = 'path',
          bicycle = 'yes',
          foot = 'yes',
          segregated = "yes",
          is_sidepath = "yes",
          ['cycleway:width'] = '5 m',
        },
        id = 1,
        type = 'way'
      }
      local result = Bikelanes(input_object)
      assert.are.equal(result[1].category, "cycleway_adjoining")
      assert.are.equal(result[1].width, 5)
    end)
  end)
end)
