package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("obstacle_category_class")

obstacle_point_categories = {
  obstacle_category_class.new({
    source = "barrier=bollard",
    side = "self",
    side_key = nil,
    perform_move = false,
    perform_buffer = 0.3,
    further_tags = { "access" },
    conditions = function(tags)
      return tags['obstacle:parking'] == 'yes' and tags.barrier == "bollard"
    end
  }),
  obstacle_category_class.new({
    source = "highway=street_lamp",
    side = "self",
    side_key = nil,
    perform_move = false,
    perform_buffer = 0.4,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['obstacle:parking'] == 'yes' and tags.highway == "street_lamp"
    end
  }),
  obstacle_category_class.new({
    source = "natural=tree",
    side = "self",
    side_key = nil,
    perform_move = false,
    perform_buffer = 1.5,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['obstacle:parking'] == 'yes' and (tags.natural == "tree" or tags.natural == "tree_stump")
    end
  }),
  obstacle_category_class.new({
    source = "highway=turning_circle", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_circle
    side = "self",
    side_key = nil,
    perform_move = false,
    perform_buffer = 10,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_circle'
    end
  }),
  obstacle_category_class.new({
    source = "highway=turning_loop", -- https://wiki.openstreetmap.org/wiki/DE:Tag:highway%3Dturning_loop
    side = "self",
    side_key = nil,
    perform_move = false,
    perform_buffer = 15,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags['highway'] == 'turning_loop'
    end
  }),
  obstacle_category_class.new({
    source = "crossing=zebra(…)",
    side = "left",
    side_key = nil,
    perform_move = true,
    perform_buffer = 4.5,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "zebra" or tags['crossing_ref'] == "zebra" or tags['crossing:markings'] == "zebra"
    end
  }),
  obstacle_category_class.new({
    source = "crossing=zebra(…)",
    side = "right",
    side_key = nil,
    perform_move = true,
    perform_buffer = 4.5,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "zebra" or tags['crossing_ref'] == "zebra" or tags['crossing:markings'] == "zebra"
    end
  }),
  obstacle_category_class.new({
    source = "crossing=marked",
    side = "left",
    side_key = nil,
    perform_move = true,
    perform_buffer = 2,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "marked"
    end
  }),
  obstacle_category_class.new({
    source = "crossing=marked",
    side = "right",
    side_key = nil,
    perform_move = true,
    perform_buffer = 2,
    further_tags = {},
    conditions = function(tags)
      return tags['crossing'] == "marked"
    end
  }),
  obstacle_category_class.new({
    source = "crossing:buffer_marking=SIDE",
    side = "left",
    side_key = "crossing:buffer_marking",
    perform_move = true,
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return tags['crossing:buffer_marking'] == "left"
    end
  }),
  obstacle_category_class.new({
    source = "crossing:buffer_marking=SIDE",
    side = "right",
    side_key = "crossing:buffer_marking",
    perform_move = true,
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return tags['crossing:buffer_marking'] == "right"
    end
  }),
  obstacle_category_class.new({
    source = "crossing:kerb_extension=SIDE",
    side = "left",
    side_key = "crossing:kerb_extension",
    perform_move = true,
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return tags['crossing:kerb_extension'] == "left"
    end
  }),
  obstacle_category_class.new({
    source = "crossing:kerb_extension=SIDE",
    side = "right",
    side_key = "crossing:kerb_extension",
    perform_move = true,
    perform_buffer = 3,
    further_tags = { "crossing" },
    conditions = function(tags)
      return tags['crossing:kerb_extension'] == "right"
    end
  }),
}
