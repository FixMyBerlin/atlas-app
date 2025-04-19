package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("ParseLength")
require("RoadClassificationRoadValue")
require("road_name")

function result_tags_roads(object)
  local id = DefaultId(object)

  local result_tags = {
    highway = object.tags.highway,
    service = object.tags.service,
    road = RoadClassificationRoadValue(object.tags),
    name = road_name(object.tags),
    width = ParseLength(object.tags.width), -- TODO: fallback
  }

  -- local tags_cc = {}
  -- CopyTags(result_tags, object.tags, tags_cc, "osm_")

  local result_meta = Metadata(object)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    tags = result_tags,
    meta = result_meta,
    minzoom = 0 -- TODO
  }
end
