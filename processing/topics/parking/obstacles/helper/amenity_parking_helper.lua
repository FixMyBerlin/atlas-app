package.path = package.path .. ";/processing/topics/helper/?.lua"
require("capacity_normalization")
require("sanitize_for_logging")
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
      orientation = sanitize_for_logging(tags.orientation, { "perpendicular", "parallel", "diagonal" }),
      informal = sanitize_for_logging(tags.informal, { "yes" }),
      access = sanitize_for_logging(tags.access, { "no" }),
      markings = sanitize_for_logging(tags.markings, { "yes", "no" }),
      disabled = sanitize_for_logging(tags.disabled, { "private" }),
      traffic_sign = SanitizeTrafficSign(tags.traffic_sign),
    }, capacity_normalization(tags)
  )
end

function amenity_parking_tags_cc(value)
  return { }
end
