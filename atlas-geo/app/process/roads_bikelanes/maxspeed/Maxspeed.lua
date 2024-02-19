package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/maxspeed/?.lua"
require("TimeUtils")
require("MaxspeedDirect")
require("MaxspeedFromZone")
require("CopyTags")
require("Set")

local tags_copied = {}
local tags_prefixed = {
  "maxspeed:backward",
  "maxspeed:forward",
  "maxspeed:conditional",
}

-- Try to find maxspeed information in the following order:
-- 1. `maxspeed` tag (also looking at `maxspeed:forward` and `maxspeed:backward`)
-- 2. maxspeed zones tags
-- 3. highway type
-- 4. TODO: intersecting landuse via SQL, see https://github.com/FixMyBerlin/atlas-geo/pull/28
function Maxspeed(object)
  local tags = object.tags
  local maxspeed_data = {}

  local maxspeed, source, confidence = MaxspeedDirect(tags)

  if maxspeed == nil then
    maxspeed, source, confidence = MaxspeedFromZone(tags)
  end

  if maxspeed == nil then
    local highway_speeds = {
      ["living_street"] = 7
    }
    if highway_speeds[tags.highway] then
      maxspeed = highway_speeds[tags.highway]
      source = "inferred_from_highway"
      confidence = 'high' -- living_street is 'high', others would be 'medium
    end
  end

  -- Freshness of data
  -- 700+ https://taginfo.openstreetmap.org/keys/check_date%3Amaxspeed
  if tags["check_date:maxspeed"] then
    maxspeed_data.maxspeed_age = AgeInDays(ParseDate(tags["check_date:maxspeed"]))
  end

  CopyTags(maxspeed_data, tags, tags_copied)
  CopyTags(maxspeed_data, tags, tags_prefixed, "osm_")
  maxspeed_data.maxspeed = maxspeed
  maxspeed_data.maxspeed_source = source
  maxspeed_data.maxspeed_confidence = confidence

  return maxspeed_data
end
