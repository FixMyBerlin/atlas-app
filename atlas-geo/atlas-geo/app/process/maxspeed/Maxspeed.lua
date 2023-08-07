package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/maxspeed/?.lua"
require("IsFresh")
require("MaxspeedDirect")
require("MaxspeedFromZone")
require("CopyTags")
require("Set")

function MaxSpeed(object)

  local tags = object.tags

  local maxspeed_data = {raw_maxspeed = tags.maxspeed} -- Preserve original value since we use `maxspeed` for our processed data
  -- TODO: Why would we want to exclude this based on this tag? (Tobias)
  -- if tags.bicycle == "no" then
  --   IntoExcludeTable(table, object, "no bikes allowed")
  --   return
  -- end

  -- Try to find maxspeed information in the following order:
  -- 1. `maxspeed` tag
  -- 2. maxspeed zones tags
  -- 3. highway type
  -- 4. SQL: intersecting landuse
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

  -- all tags that are shown on the application
 local tags_cc = {
    "maxspeed:backward",
    "maxspeed:forward",
    "maxspeed:conditional",
    "maxspeed:type",
    "zone:maxspeed",
    "source:maxspeed",
    "check_date:maxspeed",
  }
  -- TODO: replace with copy
  CopyTags(tags, maxspeed_data, tags_cc)

  -- Freshness of data (AFTER `FilterTags`!)
  IsFresh(object, "check_date:maxspeed", maxspeed_data, 'maxspeed')

  maxspeed_data.maxspeed = maxspeed
  maxspeed_data.maxspeed_source = source
  maxspeed_data.maxspeed_confidence = confidence
  maxspeed_data.maxspeed_present = true

  if maxspeed ~= nil then
    return maxspeed_data
  end
  return {maxspeed_present = false}
end
