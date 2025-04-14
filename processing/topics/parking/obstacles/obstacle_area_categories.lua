package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("class_obstacle_category")

obstacle_area_categories = {
  class_obstacle_category.new({
    id = "bicycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { "capacity" },
    conditions = function(tags)
      return tags.amenity == "bicycle_parking" and (
        tags["bicycle_parking:position"] == "lane" or
        tags["bicycle_parking:position"] == "street_side" or
        tags["bicycle_parking:position"] == "kerb_extension" or
        tags["position"] == "lane" or
        tags["position"] == "street_side" or
        tags["position"] == "kerb_extension"
      )
    end
  }),
  class_obstacle_category.new({
    id = "motorcycle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { "capacity" },
    conditions = function(tags)
      return tags.amenity == "motorcycle_parking" and (
        tags["motorcycle_parking:position"] == "lane" or
        tags["motorcycle_parking:position"] == "street_side" or
        tags["motorcycle_parking:position"] == "kerb_extension" or
        tags["position"] == "lane" or
        tags["position"] == "street_side" or
        tags["position"] == "kerb_extension"
      )
    end
  }),
  class_obstacle_category.new({
    id = "small_electric_vehicle_parking",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { "capacity" },
    conditions = function(tags)
      return tags.amenity == "small_electric_vehicle_parking" and (
        tags["small_electric_vehicle_parking:position"] == "lane" or
        tags["small_electric_vehicle_parking:position"] == "street_side" or
        tags["small_electric_vehicle_parking:position"] == "kerb_extension" or
        tags["position"] == "lane" or
        tags["position"] == "street_side" or
        tags["position"] == "kerb_extension"
      )
    end
  }),
  class_obstacle_category.new({
    id = "bicycle_rental",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { "capacity" },
    conditions = function(tags)
      return tags.amenity == "bicycle_rental" and (
        tags["bicycle_rental:position"] == "lane" or
        tags["bicycle_rental:position"] == "street_side" or
        tags["bicycle_rental:position"] == "kerb_extension" or
        tags["position"] == "lane" or
        tags["position"] == "street_side" or
        tags["position"] == "kerb_extension"
      )
    end
  }),
  class_obstacle_category.new({
    id = "mobility_hub",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { "capacity" },
    conditions = function(tags)
      return tags.amenity == "mobility_hub" and (
        tags["mobility_hub:position"] == "lane" or
        tags["mobility_hub:position"] == "street_side" or
        tags["mobility_hub:position"] == "kerb_extension" or
        tags["position"] == "lane" or
        tags["position"] == "street_side" or
        tags["position"] == "kerb_extension"
      )
    end
  }),
  class_obstacle_category.new({
    id = "parklet",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 5,
    further_tags = { },
    conditions = function(tags)
      return tags.leisure == "parklet" or tags.leisure == "outdoor_seating" and tags.outdoor_seating == "parklet"
    end
  }),
  class_obstacle_category.new({
    id = "road_marking_restricted_area",
    side_key = nil,
    perform_snap = "self",
    perform_buffer = 0.5,
    further_tags = { },
    conditions = function(tags)
      return tags['area:highway'] == "prohibited"
    end
  }),
}
