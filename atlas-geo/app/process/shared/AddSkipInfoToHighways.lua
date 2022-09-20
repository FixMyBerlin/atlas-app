-- * @desc Add `_skip = true` and `_skipNotes` for highways with private access, indoor, informal, "mtb"-style (inkl. width) and only allowed service values
function AddSkipInfoToHighways(object)
  -- Skip all non standard access values
  local allowed_access_values = Set({ "private", "no", "destination", "delivery", "permit" })
  if object.tags.access and allowed_access_values[object.tags.access] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `allowed_access_values`"
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

  ToNumber(object.tags, Set({ 'width' }))
  if object.tags.width and object.tags.width < 2.1 then
    object.tags._skipNotes = object.tags._skipNotes ..
        ";Skipped since `width<2.1m` indicates a special interest path"
    object.tags._skip = true
  end

  -- Skip all unwanted `highway=service + service=<value>` values
  -- The key can have random values, we mainly want to skip "driveway", "parking_aisle".
  local allowed_service_values = Set({ "alley", "drive-through", "emergency_access" })
  if object.tags.service and not allowed_service_values[object.tags.service] then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped by `skip_service_values`"
    object.tags._skip = true
  end
end
