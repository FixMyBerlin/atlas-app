require("Set")

-- * @desc If and why a highway object should be excluded based on its tags.
-- * @returns { boolean (shouldFilter), string (reason) }
function ExcludeHighways(tags)
  -- Skip all non standard access values
  local forbidden_accesses = Set({ "private", "no", "destination", "delivery", "permit" })
  if tags.access and forbidden_accesses[tags.access] then
    return true, "Excluded by `forbidden_accesses` for `access=" .. tags.access .. "`"
  end
  if (tags.highway == "footway" or tags.highway == "path")
      and tags.foot and forbidden_accesses[tags.foot] then
    return true, "Excluded by `forbidden_accesses` for `foot=" .. tags.foot .. "`"
  end
  if tags.highway == 'cycleway'
      and tags.bicycle and forbidden_accesses[tags.bicycle] then
    return true, "Excluded by `forbidden_accesses` for `bicycle=" .. tags.bicycle .. "`"
  end

  if tags.operator == 'private' then
    return true, "Excluded by `operator=private`"
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
  -- The key can have random values, we mainly want to skip
  -- - "driveway" which we consider implicitly private
  -- - "parking_aisle" which do not consider part of the road network (need a regular service highway if other roads connect)
  -- - "emergency_access" which we consider a special kind of driveway
  local allowed_service = Set({ "alley", "drive-through" })
  if tags.service and not allowed_service[tags.service] then
    return true, "Excluded by `service=" .. tags.service .. "`"
  end
  if tags.man_made == 'pier' then
    return true, "Excluded by `man_made=pier`"
  end

  return false, ""
end
