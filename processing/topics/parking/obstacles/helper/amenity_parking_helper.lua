package.path = package.path .. ";/processing/topics/helper/?.lua"
require("capacity_normalization")
require("Sanitize")
require("SanitizeTrafficSign")
require("MergeTable")
require("Log")

function amenity_parking_point_buffer(tags)
  -- TODO: Based on orientation + fallback, pick a width for one capacity.
  -- If no capacity given, take 1

  local todo_width = 4
  local capacity = tonumber(tags.capacity) or 1

  return capacity * todo_width
end

function amenity_parking_tags(tags)
  return MergeTable(
    {
      amenity = tags.amenity,
      parking = tags.parking,
      orientation = Sanitize(tags.orientation, { "perpendicular", "parallel", "diagonal" }),
      informal = Sanitize(tags.informal, { "yes" }),
      access = Sanitize(tags.access, { "no" }),
      markings = Sanitize(tags.markings, { "yes", "no" }),
      disabled = Sanitize(tags.disabled, { "private" }),
      traffic_sign = SanitizeTrafficSign(tags.traffic_sign),
    }, capacity_normalization(tags)
  )
end

function amenity_parking_tags_cc(value)
  return { }
end
