package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
require("CopyTags")
require("DefaultId")
require("Metadata")
require("obstacle_categories")
local inspect = require('inspect')

function parking_obstacle_points(object)
  if not object.tags then return end

  local category = categorize_obstacles(object.tags)
  if not category then return end

  if category.conditions then
    local id = DefaultId(object) .. '/' .. category.side

    local result_tags = {
      source = category.source,
      side = category.side,
      perform_buffer = category.perform_buffer,
      perform_move = category.perform_move,
    }
    CopyTags(result_tags, object.tags, category.further_tags, "osm_")

    local result_meta = Metadata(object)
    result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

    return {
      id = id,
      tags = result_tags,
      meta = result_meta,
      geom = object:as_point(),
      minzoom = 0 -- TODO
    }
  end
end
