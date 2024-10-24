describe("BikeSuitability", function()
  package.path = package.path .. ";/processing/topics/helper/?.lua"
  package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
  require("osm2pgsql")
  require("BikeSuitability")
  describe('goodSurface', function()
    it('only surface', function()
      local input_tags = {
          highway = 'path',
          surface = 'asphalt'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal('goodSurface', result.id)
    end)

    it('smoothness = bad', function()
      local input_tags = {
          highway = 'path',
          surface = 'asphalt',
          smoothness = 'bad'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal(nil, result)
    end)

    it('not a path', function()
      local input_tags = {
          highway = 'primary',
          surface = 'asphalt',
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal(nil, result)
    end)
  end)

  describe('noMotorizedVehicle', function()
    it('`motor_vehicle = no`', function()
      local input_tags = {
          highway = 'path',
          motor_vehicle = 'no'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal('noMotorizedVehicle', result.id)
    end)

    it('`traffic_sign = 250`', function()
      local input_tags = {
          highway = 'path',
          traffic_sign = 'DE:250'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal('noMotorizedVehicle', result.id)
    end)

    it('`traffic_sign = 260`', function()
      local input_tags = {
          highway = 'path',
          traffic_sign = 'DE:260'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal('noMotorizedVehicle', result.id)
    end)
  end)
  describe("noOvertaking", function ()
    it('`traffic_sign = DE:277.1`', function()
      local input_tags = {
          traffic_sign = 'DE:277.1'
        }
      local result = CategorizeBikeSuitability(input_tags)
      assert.are.equal('noOvertaking', result.id)
    end)

  end)
end)
