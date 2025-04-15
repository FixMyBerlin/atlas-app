package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("Log")

function result_tags_obstacles(result)
  local id = DefaultId(result.object) .. "/" .. result.object._side

  local result_tags = {
    category = result.category.id,
    source = result.category.source,
    side = result.object._side,
    perform_buffer = result.category.perform_buffer,
    perform_snap = result.category.perform_snap,
  }

  local tags_cc = {
    "mapillary",
  }
  CopyTags(result_tags, result.object.tags, tags_cc, "osm_")
  CopyTags(result_tags, result.object.tags, result.category.further_tags, "osm_")

  local result_meta = Metadata(result)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    tags = result_tags,
    meta = result_meta,
    minzoom = 0 -- TODO
  }
end
