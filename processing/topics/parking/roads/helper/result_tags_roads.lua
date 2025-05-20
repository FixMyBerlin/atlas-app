require('init')
require("CopyTags")
require("DefaultId")
require("Metadata")
require("RoadClassificationRoadValue")
require("road_name")
require("is_driveway")
require("is_parking")
require("road_width")

function result_tags_roads(object)
  local id = DefaultId(object)
  local width, width_confidence, width_source = road_width(object.tags)
  local is_driveway = is_driveway(object.tags)
  local category = "road"
  if(is_driveway) then category = "driveway" end

  local result_tags = {
    highway = object.tags.highway,
    road = RoadClassificationRoadValue(object.tags),
    name = road_name(object.tags),
    category = category,
    is_driveway = is_driveway,
    is_parking = is_parking(object.tags),
    width = width,
    width_confidence = width_confidence,
    width_source = width_source,
    -- NOTE: In the future we might want to also check `placement`
    -- (More about `placement` in https://strassenraumkarte.osm-berlin.org/posts/2021-12-31-micromap-update)
    perform_offset_left = width / 2 * -1,
    perform_offset_right = width / 2,
  }

  local tags_cc = {
    "mapillary",
    "service",
  }
  CopyTags(result_tags, object.tags, tags_cc, "osm_")

  local result_meta = Metadata(object)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    tags = result_tags,
    meta = result_meta,
  }
end
