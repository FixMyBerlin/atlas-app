-- TODO Lars uses a shorter version of what Jochen proposes in Github.
--  However I am missing the check for "is_closed_line" in Jochens version…

-- Lars:
function HasAreaTags(tags)
  if tags.area == 'yes' then
    return true
  end
  if tags.area == 'no' then
    return false
  end

  return false
end

-- Jochen: https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/generic.lua#L184-L221

-- Helper function that looks at the tags and decides if this is possibly an area.
-- function has_area_tags(tags)
--     if tags.area == 'yes' then
--         return true
--     end
--     if tags.area == 'no' then
--         return false
--     end

--     return tags.aeroway
--         or tags.amenity
--         or tags.building
--         or tags.harbour
--         or tags.historic
--         or tags.landuse
--         or tags.leisure
--         or tags.man_made
--         or tags.military
--         or tags.natural
--         or tags.office
--         or tags.place
--         or tags.power
--         or tags.public_transport
--         or tags.shop
--         or tags.sport
--         or tags.tourism
--         or tags.water
--         or tags.waterway
--         or tags.wetland
--         or tags['abandoned:aeroway']
--         or tags['abandoned:amenity']
--         or tags['abandoned:building']
--         or tags['abandoned:landuse']
--         or tags['abandoned:power']
--         or tags['area:highway']
--         or tags['building:part']
-- end
