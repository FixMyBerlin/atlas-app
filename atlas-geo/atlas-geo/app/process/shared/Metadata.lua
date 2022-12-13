package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"

-- * @desc Metadata of the given osm object
-- * @returns `meta` object
function Metadata(object)
  local meta = {
    ["update_at"] = os.date('!%Y-%m-%dT%H:%M:%SZ', object.timestamp),
    ["updated_by"] = object.user, -- 'user' not present in regular osm file
    ["version"] = object.version,
    ["osm_url"] = OsmUrl(object)
  }
  return meta
end
