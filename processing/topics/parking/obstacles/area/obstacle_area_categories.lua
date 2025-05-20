package.path = package.path .. ';/processing/topics/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/obstacles/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/obstacles/area/?.lua'
require('class_obstacle_category')
require('two_wheel_parking_helper')
require('amenity_parking_helper')

local function is_obstacle_parking(tags)
  return tags['obstacle:parking'] == 'yes'
end

obstacle_area_categories = {
  class_obstacle_category.new({
    id = 'bicycle_parking',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags) return two_wheel_parking_conditions(tags, 'bicycle_parking') end,
    tags = function(tags) return two_wheel_parking_tags(tags, 'bicycle_parking') end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_parking'),
  }),
  class_obstacle_category.new({
    id = 'motorcycle_parking',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags) return two_wheel_parking_conditions(tags, 'motorcycle_parking') end,
    tags = function(tags) return two_wheel_parking_tags(tags, 'motorcycle_parking') end,
    tags_cc = two_wheel_parking_tags_cc('motorcycle_parking'),
  }),
  class_obstacle_category.new({
    id = 'small_electric_vehicle_parking',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags) return two_wheel_parking_conditions(tags, 'small_electric_vehicle_parking') end,
    tags = function(tags) return two_wheel_parking_tags(tags, 'small_electric_vehicle_parking') end,
    tags_cc = two_wheel_parking_tags_cc('small_electric_vehicle_parking'),
  }),
  class_obstacle_category.new({
    id = 'bicycle_rental',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags) return two_wheel_parking_conditions(tags, 'bicycle_rental') end,
    tags = function(tags) return two_wheel_parking_tags(tags, 'bicycle_rental') end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_rental'),
  }),
  class_obstacle_category.new({
    id = 'mobility_hub',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags) return two_wheel_parking_conditions(tags, 'mobility_hub') end,
    tags = function(tags) return two_wheel_parking_tags(tags, 'mobility_hub') end,
    tags_cc = two_wheel_parking_tags_cc('mobility_hub'),
  }),
  class_obstacle_category.new({
    id = 'parklet',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return tags.leisure == 'parklet' or tags.leisure == 'outdoor_seating' and tags.outdoor_seating == 'parklet'
    end,
    tags = function(tags) return {} end,
    tags_cc = { 'leisure', 'outdoor_seating' },
  }),
  class_obstacle_category.new({
    id = 'road_marking_restricted_area',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return tags['area:highway'] == 'prohibited'
    end,
    tags = function(tags) return {} end,
    tags_cc = { 'area:highway' },
  }),
  class_obstacle_category.new({
    -- https://www.openstreetmap.org/way/1198952905
    -- https://www.openstreetmap.org/way/1181489790 disabled
    id = 'parking_lane',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return tags['amenity'] == 'parking' and tags['parking'] == 'lane'
    end,
    tags = function(tags) return amenity_parking_tags(tags) end,
    tags_cc = amenity_parking_tags_cc(),
  }),
  class_obstacle_category.new({
    -- https://www.openstreetmap.org/way/559505481
    id = 'parking_street_side',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return tags['amenity'] == 'parking' and tags['parking'] == 'street_side'
    end,
    tags = function(tags) return amenity_parking_tags(tags) end,
    tags_cc = amenity_parking_tags_cc(),
  }),
  class_obstacle_category.new({
    -- https://www.openstreetmap.org/way/1127983079
    id = 'tree_pit',
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.landuse == "tree_pit"
    end,
    tags = function(tags) return { landuse = tags.landuse } end,
    tags_cc = {},
  }),
}
