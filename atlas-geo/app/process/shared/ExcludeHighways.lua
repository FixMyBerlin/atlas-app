-- * @desc If and why a highway object should be excluded based on its tags.
-- * @returns { boolean (shouldFilter), string (reason) }
function ExcludeHighways(tags)
  -- Skip all non standard access values
  local forbidden_accesses = Set({ "private", "no", "destination", "delivery", "permit" })
  if tags.access and forbidden_accesses[tags.access] then
    return true, "Excluded by `forbidden_accesses`"
  end

  if tags.operator == 'private' then
    return true, "Excluded by `operator=private`"
  end

  if tags.foot == 'private' then
    return true, "Excluded by `foot=private`"
  end

  if tags.indoor == 'yes' then
    return true, "Excluded by `indoor=yes`"
  end

  if tags.informal == 'yes' then
    return true, "Excluded by `informal=yes`"
  end

  if tags['mtb:scale'] then
    return true, "Excluded since `mtb:scale` indicates a special interest path"
  end

  if tags.tracktype == "grade5" then
    return true, "Excluded since `tracktype=grade5` indicates a special interest path"
  end

  -- Skip all unwanted `highway=service + service=<value>` values
  -- The key can have random values, we mainly want to skip "driveway", "parking_aisle".
  local forbidden_services = Set({ "alley", "drive-through", "emergency_access" })
  if tags.service and not forbidden_services[tags.service] then
    return true, "Excluded by `forbidden_services`"
  end
  if tags.man_made == 'pier' then
    return true, "Excluded by `man_made=pier`"
  end

  return false, nil
end
