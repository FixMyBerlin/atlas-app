function IsTermInString(searchTerm, toSearchInString)
  if (toSearchInString == nil) then return false end
  if (searchTerm == nil) then return false end

  return string.find(toSearchInString, searchTerm, 1, true)
end
