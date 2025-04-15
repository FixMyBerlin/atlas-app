package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/point/?.lua"
require("class_obstacle_category")

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
    perform_buffer = 0.3,
    further_tags = { "access" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.barrier == "bollard"
    end
  }),
  class_obstacle_category.new({
    id = "street_lamp",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.4,
    further_tags = { "ref" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and tags.highway == "street_lamp"
    end
  }),
  class_obstacle_category.new({
    id = "tree",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 1.5,
    further_tags = { "ref" },
    conditions = function(tags)
      return is_obstacle_parking(tags) and (tags.natural == "tree" or tags.natural == "tree_stump")
    end
  }),
  class_obstacle_category.new({
    id = "turning_circle", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_circle
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 10,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_circle'
    end
  }),
  class_obstacle_category.new({
    id = "turning_loop", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_loop
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 15,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_loop'
    end
  }),
  class_obstacle_category.new({
    id = "crossing_zebra",
    side_key = nil,
    perform_snap = "side",
    perform_buffer = 4.5,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "zebra" or tags['crossing_ref'] == "zebra" or tags['crossing:markings'] == "zebra"
    end
  }),
  class_obstacle_category.new({
    id = "crossing_marked",
    side_key = nil,
    perform_snap = "side",
    perform_buffer = 2,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "marked"
    end
  }),
  class_obstacle_category.new({
    id = "crossing_buffer_marking",
    side_key = "crossing:buffer_marking",
    perform_snap = "side",
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return is_left_right_both(tags['crossing:buffer_marking'])
    end
  }),
  class_obstacle_category.new({
    id = "crossing_kerb_extension",
    side_key = "crossing:kerb_extension",
    perform_snap = "side",
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return is_left_right_both(tags['crossing:kerb_extension'])
    end
  }),
}
