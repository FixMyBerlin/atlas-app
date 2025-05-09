package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/area/?.lua"
require("class_obstacle_category")
require("two_wheel_parking_helper")
require("amenity_parking_helper")

obstacle_area_categories = {
  class_obstacle_category.new({
    id = "bicycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return two_wheel_parking_tags(tags, "bicycle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "bicycle_parking") end,
  }),
  class_obstacle_category.new({
    id = "motorcycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return two_wheel_parking_tags(tags, "motorcycle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('motorcycle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "motorcycle_parking") end,
  }),
  class_obstacle_category.new({
    id = "small_electric_vehicle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return two_wheel_parking_tags(tags, "small_electric_vehicle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('small_electric_vehicle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "small_electric_vehicle_parking") end,
  }),
  class_obstacle_category.new({
    id = "bicycle_rental",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return two_wheel_parking_tags(tags, "bicycle_rental") end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_rental'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "bicycle_rental") end,
  }),
  class_obstacle_category.new({
    id = "mobility_hub",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return two_wheel_parking_tags(tags, "mobility_hub") end,
    tags_cc = two_wheel_parking_tags_cc('mobility_hub'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "mobility_hub") end,
  }),
  class_obstacle_category.new({
    id = "parklet",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return {} end,
    tags_cc = { "leisure", "outdoor_seating" },
    conditions = function(tags)
      return tags.leisure == "parklet" or tags.leisure == "outdoor_seating" and tags.outdoor_seating == "parklet"
    end
  }),
  class_obstacle_category.new({
    id = "road_marking_restricted_area",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return {} end,
    tags_cc = { "area:highway" },
    conditions = function(tags)
      return tags['area:highway'] == "prohibited"
    end
  }),
  class_obstacle_category.new({
    -- https://www.openstreetmap.org/way/1198952905
    -- https://www.openstreetmap.org/way/1181489790 disabled
    id = "parking_lane",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return amenity_parking_tags(tags) end,
    tags_cc = amenity_parking_tags_cc(),
    conditions = function(tags)
      return tags['amenity'] == "parking" and tags['parking'] == "lane"
    end
  }),
  class_obstacle_category.new({
    -- https://www.openstreetmap.org/way/559505481
    id = "parking_street_side",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return nil end,
    tags = function(tags) return amenity_parking_tags(tags) end,
    tags_cc = amenity_parking_tags_cc(),
    conditions = function(tags)
      return tags['amenity'] == "parking" and tags['parking'] == "street_side"
    end
  }),
}
