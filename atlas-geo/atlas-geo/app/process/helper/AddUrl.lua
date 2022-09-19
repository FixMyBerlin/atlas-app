-- * @param `osm_type` can be 'way', 'node', 'relation' (valid osm.org URL parts)
function AddUrl(osm_type, object)
  object.tags.osm_url = "https://osm.org/" .. osm_type .. "/" .. object.id
end
