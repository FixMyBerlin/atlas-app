package.path = package.path .. ";/processing/topics/helper/?.lua"
require("ParseLength")

local highway_width_fallbacks = {
  ["primary"] = 17,
  ["primary_link"] = 6,
  ["secondary"] = 15,
  ["secondary_link"] = 6,
  ["tertiary"] = 13,
  ["tertiary_link"] = 6,
  ["residential"] = 11,
  ["unclassified"] = 11,
  ["living_street"] = 6,
  ["pedestrian"] = 11,
  ["road"] = 11,
  ["service"] = 4,
  ["track"] = 2.5,
  ["bus_guideway"] = 3,
}

function road_width(tags)
  if tags.width then
    local width = ParseLength(tags.width)
    if width then
      return width
    end
  end

  local base_width = highway_width_fallbacks[tags.highway] or 10
  if tags.oneway == "yes" then
    return base_width * 2 / 3
  end
  return base_width
end
