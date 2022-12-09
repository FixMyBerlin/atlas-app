-- Docs https://wiki.openstreetmap.org/wiki/Key:addr:*
-- NAEM SUGESTION: InferAdress
-- * @return `allowed_tags` array to be used with `FilterTags(tags, Set(MergeArray(thisReturnTable, otherTable)))`
function AddAddress(tags)
  local street = tags.street or tags["addr:street"]
  tags.street = nil
  tags["addr:street"] = nil
  local postcode = tags.postcode or tags["addr:postcode"]
  tags.postcode = nil
  tags["addr:postcode"] = nil
  local city = tags.city or tags["addr:city"]
  tags.city = nil
  tags["addr:city"] = nil
  local housenumber = tags.housenumber or tags["addr:housenumber"]
  tags.housenumber = nil
  tags["addr:housenumber"] = nil

  tags.addr_street = street
  tags.addr_zip = postcode
  tags.addr_city = city
  tags.addr_number = housenumber

  return { "addr_street", "addr_zip", "addr_city", "addr_number" }
end

AdressTags = { "addr_street", "addr_zip", "addr_city", "addr_number" }
