-- * @param `osm_type` can be 'way', 'node', 'relation' (valid osm.org URL parts)
function OsmUrl(object)
  return "https://osm.org/" .. object.type .. "/" .. object.id
end

function AddUrl(osm_type, object)
  object.tags.osm_url = OsmUrl( object)
end
