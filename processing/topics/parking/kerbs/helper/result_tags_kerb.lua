package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("ParseLength")
require("RoadClassificationRoadValue")

function result_tags_kerb(object)
  local id = DefaultId(object) .. "/" .. object._side

  local result_tags = {
    name = object.tags.name or object.tags.ref or object.tags['is_sidepath:of:name'],
    width = ParseLength(object.tags.width), -- TODO: fallback
    road = RoadClassificationRoadValue(object.tags),
    side = object._side,
    perform_move = 3, -- TODO: Based on width/2
  }
  if object._side == "left" then
    result_tags.perform_move = result_tags.perform_move * -1 -- LATER: Specific value based on which lane the centerline uses…
  end

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
