package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
package.path = package.path .. ";/processing/topics/raods/helper/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("RoadClassificationRoadValue")
require("road_name")
require("exit_processing_service_roads")
require("road_width")

function result_tags_roads(object)
  local id = DefaultId(object)

  local width = road_width(object.tags)

  local result_tags = {
    highway = object.tags.highway,
    service = object.tags.service,
    road = RoadClassificationRoadValue(object.tags),
    name = road_name(object.tags),
    is_service = not exit_processing_service_roads(object.tags),
    width = width,
    -- NOTE: In the future we might want to also check `placement`
    -- (More about `placement` in https://strassenraumkarte.osm-berlin.org/posts/2021-12-31-micromap-update)
    perform_offset_left = width / 2 * -1,
    perform_offset_right = width / 2,
  }

  local tags_cc = {
    "mapillary",
  }
  CopyTags(result_tags, object.tags, tags_cc, "osm_")

  local result_meta = Metadata(object)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    tags = result_tags,
    meta = result_meta,
    minzoom = 0 -- TODO
  }
end
