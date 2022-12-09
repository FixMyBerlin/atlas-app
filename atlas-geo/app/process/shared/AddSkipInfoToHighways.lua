function FilterHighways(tags)
  -- Skip all non standard access values
  local forbidden_accesses = Set({ "private", "no", "destination", "delivery", "permit" })
  if tags.access and forbidden_accesses[tags.access] then
    return true, "Skipped by `forbidden_accesses`"
  end
  if tags.operator == 'private' then
    return true, "Skipped by `operator=private`"
  end
  if tags.foot == 'private' then
    return true, "Skipped by `foot=private`"
  end

  if tags.indoor == 'yes' then
    return true, "Skipped by `indoor=yes`"
  end

  if tags.informal == 'yes' then
    return true, "Skipped by `informal=yes`"
  end

  if tags['mtb:scale'] then
    return true, "Skipped since `mtb:scale` indicates a special interest path"
  end

  if tags.tracktype == "grade5" then
    return true, "Skipped since `tracktype=grade5` indicates a special interest path"
  end

  -- Skip all unwanted `highway=service + service=<value>` values
  -- The key can have random values, we mainly want to skip "driveway", "parking_aisle".
  local forbidden_services = Set({ "alley", "drive-through", "emergency_access" })
  if tags.service and not forbidden_services[tags.service] then
    return true, "Skipped by `forbidden_services`"
  end
  if tags.man_made == 'pier' then
    return true, "Skipped by `man_made=pier`"
  end

  return false, ""
end


-- * @desc Add `_skip = true` and `_skipNotes` for highways with private access, indoor, informal, "mtb"-style (inkl. width) and only allowed service values
--  DEPRECATED
function AddSkipInfoToHighways(object)
  if object.tags._skipNotes == nil then
    object.tags._skipNotes = ""
  end
  -- Skip all non standard access values
  local forbidden_accesses = Set({ "private", "no", "destination", "delivery", "permit" })
  if object.tags.access and forbidden_accesses[object.tags.access] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `forbidden_accesses`"
    object.tags._skip = true
  end

  if object.tags.operator == 'private' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `operator=private`"
    object.tags._skip = true
  end

  if object.tags.foot == 'private' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `foot=private`"
    object.tags._skip = true
  end

  if object.tags.indoor == 'yes' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `indoor=yes`"
    object.tags._skip = true
  end

  if object.tags.informal == 'yes' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `informal=yes`"
    object.tags._skip = true
  end

  if object.tags['mtb:scale'] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped since `mtb:scale` indicates a special interest path"
    object.tags._skip = true
  end

  if object.tags.tracktype == "grade5" then
    object.tags._skipNotes = object.tags._skipNotes ..
        ";Skipped since `tracktype=grade5` indicates a special interest path"
    object.tags._skip = true
  end

  -- Skip all unwanted `highway=service + service=<value>` values
  -- The key can have random values, we mainly want to skip "driveway", "parking_aisle".
  local forbidden_services = Set({ "alley", "drive-through", "emergency_access" })
  if object.tags.service and not forbidden_services[object.tags.service] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `skip_service_values`"
    object.tags._skip = true
  end

  if object.tags.man_made == 'pier' then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `man_made=pier`"
    object.tags._skip = true
  end
end
