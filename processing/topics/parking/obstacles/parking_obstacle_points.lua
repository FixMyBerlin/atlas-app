package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("categorize_and_transform")
require("obstacle_point_categories")


function result_tags(result)
  local id = DefaultId(result.object) .. '/' .. result.object._side

  local result_tags = {
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

function parking_obstacle_points(object)
  if not object.tags then return end
  local results = {}

  local self_left_right = categorize_and_transform(object)
  for _, result in ipairs(self_left_right) do
    if result.category then
      -- `geom` cannot be part of result_tags because that makes testing result_tags harder
      table.insert(results, MergeTable({ geom = result.object:as_point() }, result_tags(result)))
    end
  end

  return results
end
