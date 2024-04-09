package.path = package.path .. ";/app/topics/helper/?.lua"
require("TimeUtils")

-- * @desc Metadata of the given osm object
-- * @returns `meta` object
function Metadata(object)
  local meta = {
    -- Reminder: Age of last tag modification; just moving the nodes don't touch the timestamp; but adding/removing nodes does
    ["update_at"] = os.date('!%Y-%m-%dT%H:%M:%SZ', object.timestamp),
    ["updated_by"] = object.user,                           -- 'user' not present in regular osm file
    ["updated_age"] = AgeInDays(object.timestamp),
    ["id"] = string.lower(object.type) .. "/" .. object.id, -- used in maplibre with `promoteId`
    -- Disabled to reduce space:
    -- ["version"] = object.version,
    -- ["osm_url"] = "https://osm.org/" .. object.type .. "/" .. object.id
  }
  return meta
end
