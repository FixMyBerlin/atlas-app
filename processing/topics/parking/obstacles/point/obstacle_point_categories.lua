package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
require("sanitize_for_logging")
require("class_obstacle_category")
require("two_wheel_parking_helper")
require("amenity_parking_helper")

local function is_left_right_both(input)
  return input == "left" or input == "right" or input == "both"
end

local function is_obstacle_parking(tags)
  return tags['obstacle:parking'] == 'yes'
end

obstacle_point_categories = {
  class_obstacle_category.new({
    id = "bollard",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 0.3 end,
    tags = function(tags) return {} end,
    tags_cc = { "barrier", "access" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.barrier == "bollard"
    end
  }),
  class_obstacle_category.new({
    id = "street_lamp",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 0.4 end,
    tags = function(tags) return {} end,
    tags_cc = { "highway", "ref" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.highway == "street_lamp"
    end
  }),
  class_obstacle_category.new({
    id = "tree",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 1.5 end,
    tags = function(tags) return { natural = sanitize_for_logging(tags.natural, { "tree", "tree_stump" }) } end,
    tags_cc = { "natural", "ref" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and (tags.natural == "tree" or tags.natural == "tree_stump")
    end
  }),
  class_obstacle_category.new({
    id = "street_cabinet", -- https://wiki.openstreetmap.org/wiki/Tag:man_made%3Dstreet_cabinet
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 1.5 end, -- todo: based on widt endh
    tags = function(tags) return {} end,
    tags_cc = { "street_cabinet" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.man_made == "street_cabinet"
    end
  }),
  class_obstacle_category.new({
    id = "advertising", -- https://wiki.openstreetmap.org/wiki/Key:traffic_sign
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 0.3 end,
    tags = function(tags) return {} end,
    tags_cc = { "traffic_sign", "highway" },
    conditions = function(tags)
      -- highway=traffic_sign is not used a lot but a way to describe a unspecified sign
      return is_obstacle_parking(tags) and (tags.traffic_sign ~= nil or tags.highway == "traffic_sign")
    end
  }),
  class_obstacle_category.new({
    id = "turning_circle", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_circle
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 10 end,
    tags = function(tags) return {} end,
    tags_cc = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_circle'
    end
  }),
  class_obstacle_category.new({
    id = "turning_loop", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_loop
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 15 end,
    tags = function(tags) return {} end,
    tags_cc = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_loop'
    end
  }),
  class_obstacle_category.new({
    id = "bus_stop", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dbus_stop
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return 15 end,
    tags = function(tags) return {} end,
    tags_cc = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'bus_stop'
    end
  }),
  class_obstacle_category.new({
    id = "crossing_zebra",
    side_key = nil,
    perform_snap = "side",
    perform_buffer = function(tags) return 4.5 end,
    tags = function(tags) return {} end,
    tags_cc = { "crossing", "crossing_ref", "crossing:markings", "crossing:buffer_marking", "crossing:kerb_extension" },
    conditions = function(tags)
      return tags['crossing'] == "zebra" or tags['crossing_ref'] == "zebra" or tags['crossing:markings'] == "zebra"
    end
  }),
  class_obstacle_category.new({
    id = "crossing_marked",
    side_key = nil,
    perform_snap = "side",
    perform_buffer = function(tags) return 2 end,
    tags = function(tags) return {} end,
    tags_cc = {},
    conditions = function(tags)
      return tags['crossing'] == "marked"
    end
  }),
  class_obstacle_category.new({
    id = "crossing_buffer_marking",
    side_key = "crossing:buffer_marking",
    perform_snap = "side",
    perform_buffer = function(tags) return 3 end,
    tags = function(tags) return {} end,
    tags_cc = { "crossing", "crossing_ref", "crossing:markings", "crossing:buffer_marking", "crossing:kerb_extension" },
    conditions = function(tags)
      return is_left_right_both(tags['crossing:buffer_marking'])
    end
  }),
  class_obstacle_category.new({
    id = "crossing_kerb_extension",
    side_key = "crossing:kerb_extension",
    perform_snap = "side",
    perform_buffer = function(tags) return 3 end,
    tags = function(tags) return {} end,
    tags_cc = { "crossing", "crossing_ref", "crossing:markings", "crossing:buffer_marking", "crossing:kerb_extension" },
    conditions = function(tags)
      return is_left_right_both(tags['crossing:kerb_extension'])
    end
  }),
  class_obstacle_category.new({
    id = "bicycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return two_wheel_parking_buffer(tags) end,
    tags = function(tags) return two_wheel_parking_tags(tags, "bicycle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "bicycle_parking") end,
  }),
  class_obstacle_category.new({
    id = "motorcycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return two_wheel_parking_buffer(tags) end,
    tags = function(tags) return two_wheel_parking_tags(tags, "motorcycle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('motorcycle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "motorcycle_parking") end,
  }),
  class_obstacle_category.new({
    id = "small_electric_vehicle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return two_wheel_parking_buffer(tags) end,
    tags = function(tags) return two_wheel_parking_tags(tags, "small_electric_vehicle_parking") end,
    tags_cc = two_wheel_parking_tags_cc('small_electric_vehicle_parking'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "small_electric_vehicle_parking") end,
  }),
  class_obstacle_category.new({
    id = "bicycle_rental",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return two_wheel_parking_buffer(tags) end,
    tags = function(tags) return two_wheel_parking_tags(tags, "bicycle_rental") end,
    tags_cc = two_wheel_parking_tags_cc('bicycle_rental'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "bicycle_rental") end,
  }),
  class_obstacle_category.new({
    id = "mobility_hub",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = function(tags) return two_wheel_parking_buffer(tags) end,
    tags = function(tags) return two_wheel_parking_tags(tags, "mobility_hub") end,
    tags_cc = two_wheel_parking_tags_cc('mobility_hub'),
    conditions = function(tags) return two_wheel_parking_conditions(tags, "mobility_hub") end,
    }),
    class_obstacle_category.new({
      id = "parking_lane",
      side_key = nil,
      perform_snap = "self",
      perform_buffer = function(tags) return amenity_parking_point_buffer(tags) end,
      tags = function(tags) return amenity_parking_tags(tags) end,
      tags_cc = amenity_parking_tags_cc(),
      conditions = function(tags)
        return tags['amenity'] == "parking" and tags['parking'] == "lane"
      end
    }),
    class_obstacle_category.new({
      id = "parking_street_side",
      side_key = nil,
      perform_snap = "self",
      perform_buffer = function(tags) return amenity_parking_point_buffer(tags) end,
      tags = function(tags) return amenity_parking_tags(tags) end,
      tags_cc = amenity_parking_tags_cc(),
      conditions = function(tags)
        return tags['amenity'] == "parking" and tags['parking'] == "street_side"
      end
    }),
}
