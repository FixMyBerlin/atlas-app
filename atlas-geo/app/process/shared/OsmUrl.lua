-- * @desc URL to osm.org
-- * @returns string of type URL
function OsmUrl(object)
  return "https://osm.org/" .. object.type .. "/" .. object.id
end
