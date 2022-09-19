-- Docs https://wiki.openstreetmap.org/wiki/Key:addr:*

-- * @return `allowed_tags` array to be used with `FilterTags(tagsObject, Set(MergeArray(thisReturnTable, otherTable)))`
function AddAddress(tagsObject)
  local street = tagsObject.street or tagsObject["addr:street"]
  tagsObject.street = nil
  tagsObject["addr:street"] = nil
  local postcode = tagsObject.postcode or tagsObject["addr:postcode"]
  tagsObject.postcode = nil
  tagsObject["addr:postcode"] = nil
  local city = tagsObject.city or tagsObject["addr:city"]
  tagsObject.city = nil
  tagsObject["addr:city"] = nil
  local housenumber = tagsObject.housenumber or tagsObject["addr:housenumber"]
  tagsObject.housenumber = nil
  tagsObject["addr:housenumber"] = nil

  tagsObject.addr_street = street
  tagsObject.addr_zip = postcode
  tagsObject.addr_city = city
  tagsObject.addr_number = housenumber

  return { "addr_street", "addr_zip", "addr_city", "addr_number" }
end
