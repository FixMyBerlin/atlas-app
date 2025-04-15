package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("RoadClassification")

function result_tags_kerbs(object)
  local id = DefaultId(object) .. "/" .. object._side

  local road_classification = RoadClassification(object)
  local result_tags = {
    name = object.tags.name or object.tags.ref or object.tags['is_sidepath:of:name'],
    road = road_classification.road,
    side = object._side,
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
