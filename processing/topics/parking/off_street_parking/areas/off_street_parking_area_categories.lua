require('init')
require('class_off_street_parking_category')
require('sanitize_for_logging')

local off_street_parking_area_categories = {
  class_off_street_parking_category.new({
    -- Wiki https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dparking
    id = 'outside',
    conditions = function(tags)
      return tags.amenity == 'parking' and (
        tags.parking == nil or
        tags.parking == 'surface' or
        tags.parking == 'rooftop' or
        tags.parking == 'layby'
      )
    end,
    tags = function(tags) return {
      amenity = tags.amenity,
      capacity = tonumber(tags.capacity),
      parking = tags.parking, -- sanitized by `conditions`
      access = sanitize_for_logging(tags.access, { 'customers', 'permissive', 'private' }, { 'yes' }),
    } end,
    tags_cc = { 'fee', 'maxstay' },
  }),
  class_off_street_parking_category.new({
    -- Wiki https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dparking
    id = 'building',
    conditions = function(tags)
      return tags.amenity == 'parking' and (
        tags.parking == 'underground' or
        tags.parking == 'multi-storey' or
        tags.parking == 'carport' or
        tags.parking == 'sheds' or
        tags.parking == 'garage_boxes'
      )
    end,
    tags = function(tags) return {
      amenity = tags.amenity,
      capacity = tonumber(tags.capacity),
      parking = tags.parking, -- sanitized by `conditions`
      access = sanitize_for_logging(tags.access, { 'customers', 'permissive', 'private' }, { 'yes' }),
    } end,
    tags_cc = { 'fee', 'maxstay' },
  }),
  class_off_street_parking_category.new({
    -- Wiki https://wiki.openstreetmap.org/wiki/Tag:building%3Dgarages
    -- Wiki https://wiki.openstreetmap.org/wiki/Tag:building%3Dgarage
    id = 'building',
    conditions = function(tags)
      -- (!) Every single(!) building value(!) needs to be allowed in processing/filter/filter-expressions.txt
      return tags.building == 'garages' or
        tags.building == 'garage' or
        tags.building == 'carport'
    end,
    tags = function(tags) return {
      building = tags.building,
      capacity = tonumber(tags.capacity),
      access = sanitize_for_logging(tags.access, { 'customers', 'permissive', 'private' }, { 'yes' }),
    } end,
    tags_cc = { 'fee', 'maxstay' },
  }),
}

return off_street_parking_area_categories
