-- * @param `osm_type` can be 'way', 'node', 'relation' (valid osm.org URL parts)
function OsmUrl(osm_type, object)
  return "https://osm.org/" .. osm_type .. "/" .. object.id
end

function AddUrl(osm_type, object)
  object.tags.osm_url = OsmUrl(osm_type, object)
end
