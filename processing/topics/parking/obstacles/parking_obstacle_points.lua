package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("duplicate_left_right")
require("categorize_obstacles")
require("obstacle_point_categories")
local inspect = require('inspect')

local tags_cc = {
  "mapillary",
}

function parking_obstacle_points(object)
  if not object.tags then return end

  local transformations = duplicate_left_right(object)
  if not transformations then return end

  local results = {}
  for _, transformation in ipairs(transformations) do
    local category = categorize_obstacles(transformation.tags, obstacle_point_categories)
    if category and category.conditions then
      local id = DefaultId(transformation) .. '/' .. category.side

      local result_tags = {
        source = category.source,
        side = category.side,
        perform_buffer = category.perform_buffer,
        perform_move = category.perform_move,
      }
      CopyTags(result_tags, transformation.tags, category.further_tags, "osm_")
      CopyTags(result_tags, transformation.tags, tags_cc, "osm_")

      local result_meta = Metadata(transformation)
      result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

      table.insert(results, {
        id = id,
        tags = result_tags,
        meta = result_meta,
        geom = transformation:as_point(),
        minzoom = 0 -- TODO
      })
    end
  end

  return results
end
