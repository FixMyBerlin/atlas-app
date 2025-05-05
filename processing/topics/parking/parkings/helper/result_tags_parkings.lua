package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
require("CopyTags")
require("MergeTable")
require("DefaultId")
require("Metadata")
require("ParseLength")
require("RoadClassificationRoadValue")
require("road_name")
require("Log")

function result_tags_parkings(object)
  local id = DefaultId(object) .. "/" .. object._side

  local result_tags = {
    name = road_name(object.tags),
    -- width = ParseLength(object.tags.width), -- TODO calculate based on direction
    -- parent_road = RoadClassificationRoadValue(object._parent_tags),
  }

  MergeTable(result_tags, object.tags)
  local tags_cc = {
    "mapillary",
  }
  CopyTags(result_tags, object._parent_tags, tags_cc, "osm_")
  CopyTags(result_tags, object.tags, tags_cc, "osm_")

  local result_meta = Metadata(object)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    side = object._side,
    tags = result_tags,
    meta = result_meta,
    minzoom = 0 -- TODO
  }
end
