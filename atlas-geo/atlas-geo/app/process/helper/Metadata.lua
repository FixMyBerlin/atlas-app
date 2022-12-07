
function OsmUrl(object)
  return "https://osm.org/" .. object.type .. "/" .. object.id
end

-- We use the tags-"object" to make the timestamp accessible.
-- The osm2pgsql examples use store the timestamp as a separate column. But…
--    - …I could not get this working
--    - …and I don't see the benefit. Maybe it is needed to efficintly filter the table for incremental updates?
-- Docs: https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/attributes.lua#L18-L21
--    But maybe also https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/unitable.lua#L63-L66 ?

function Metadata(object)
  local meta = {
    ["update_at"] = os.date('!%Y-%m-%dT%H:%M:%SZ', object.timestamp),
    ["updated_by"] = object.user,  -- 'user' not present in regular osm file
    ["version"] = object.version,
    ["osm_url"] = OsmUrl(object)
  }
  return meta
end

