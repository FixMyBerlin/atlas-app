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
