-- @param type can be 'way', 'node', 'relation' (valid osm.org URL parts)
function AddUrl(type, object)
  object.tags.osm_url = "https://osm.org/" .. type .. "/" .. object.id
end
