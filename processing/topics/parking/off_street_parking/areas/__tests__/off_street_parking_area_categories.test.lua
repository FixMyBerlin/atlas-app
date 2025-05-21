require('init')
require('Log')
local off_street_parking_area_categories = require("off_street_parking_area_categories")
local categorize_off_street_parking = require('categorize_off_street_parking')
local result_tags_off_street_parking = require('result_tags_off_street_parking')

describe("off_street_parking_area_categories", function()
  describe("building case", function()
    it("matches garages", function()
      local object = { id = 1, type = 'way', tags = { amenity = "parking", parking = "underground", capacity = "10", access = "private" } }
      local category_result = categorize_off_street_parking(object, off_street_parking_area_categories)
      local tags_result = result_tags_off_street_parking(category_result)

      assert.are.equal(category_result.category.id, "building")
      assert.are.equal(tags_result.tags.category, "building")
      assert.are.equal(tags_result.tags.parking, "underground")
      assert.are.equal(tags_result.tags.capacity, 10)
      assert.are.equal(tags_result.tags.access, "private")
    end)
    it("matches garages", function()
      local object = { id = 1, type = 'way', tags = { building = "garages", capacity = "10", access = "private" } }
      local category_result = categorize_off_street_parking(object, off_street_parking_area_categories)
      local tags_result = result_tags_off_street_parking(category_result)

      assert.are.equal(category_result.category.id, "building")
      assert.are.equal(tags_result.tags.category, "building")
      assert.are.equal(tags_result.tags.building, "garages")
      assert.are.equal(tags_result.tags.capacity, 10)
      assert.are.equal(tags_result.tags.access, "private")
    end)

    it("matches garage", function()
      local object = { id = 1, type = 'way', tags = { building = "garage", capacity = "5", access = "customers" } }
      local category_result = categorize_off_street_parking(object, off_street_parking_area_categories)
      local tags_result = result_tags_off_street_parking(category_result)

      assert.are.equal(category_result.category.id, "building")
      assert.are.equal(tags_result.tags.category, "building")
      assert.are.equal(tags_result.tags.building, "garage")
      assert.are.equal(tags_result.tags.capacity, 5)
      assert.are.equal(tags_result.tags.access, "customers")
    end)

    it("matches carport", function()
      local object = { id = 1, type = 'way', tags = { building = "carport", capacity = "2", access = "permissive" } }
      local category_result = categorize_off_street_parking(object, off_street_parking_area_categories)
      local tags_result = result_tags_off_street_parking(category_result)

      assert.are.equal(category_result.category.id, "building")
      assert.are.equal(tags_result.tags.category, "building")
      assert.are.equal(tags_result.tags.building, "carport")
      assert.are.equal(tags_result.tags.capacity, 2)
      assert.are.equal(tags_result.tags.access, "permissive")
    end)

    it("does not match unrelated building", function()
      local object = { id = 1, type = 'way', tags = { building = "house", capacity = "1" } }
      local category_result = categorize_off_street_parking(object, off_street_parking_area_categories)

      assert.is_nil(category_result.category)
    end)
  end)
end)
