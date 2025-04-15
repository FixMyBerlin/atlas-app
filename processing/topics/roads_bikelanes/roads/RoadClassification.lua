package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
require("Set")
require("CopyTags")
require("Sanitize")
require("DeriveTrafficSigns")
require("ParseLength")
require("MergeTable")
require("RoadClassificationRoadValue")

local tags_copied = {
  "mapillary",
  "description",
}
local tags_prefixed = {}

function RoadClassification(object)
  local tags = object.tags
  local result_tags = {
    road = RoadClassificationRoadValue(object.tags)
  }

  -- Mischverkehr
  -- INFO: Deactivated for now. Not needed during styling and buggy ATM.
  -- if tags.bicycle ~= 'no' and tags.bicycle ~= 'use_sidepath' then
  --   if MinorRoadClasses[tags.highway] or MajorRoadClasses[tags.highway] then
  --     roadClassification.road_implicit_shared_lane = true
  --   end
  -- end


  if tags.oneway == 'yes' then
    -- Note: We do not pass 'oneway=no' to the 'road_oneway' key
    -- because it is the default which we do not want to show in the UI.
    result_tags.road_oneway = tags.oneway
    if tags.dual_carriageway == "yes" then
      result_tags.road_oneway = tags.oneway .. '_dual_carriageway'
    end
  end
  if tags['oneway:bicycle'] == 'no' or tags['oneway:bicycle'] then
    result_tags['road_oneway:bicycle'] = tags['oneway:bicycle']
  end

  CopyTags(result_tags, tags, tags_copied)
  CopyTags(result_tags, tags, tags_prefixed, "osm_")
  result_tags.width = ParseLength(tags.width)
  result_tags.oneway = Sanitize(tags.oneway, { "yes", "no" })
  result_tags.bridge = Sanitize(tags.bridge, { "yes" })
  result_tags.tunnel = Sanitize(tags.tunnel, { "yes" })
  MergeTable(result_tags, DeriveTrafficSigns(tags))

  return result_tags
end
