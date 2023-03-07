function ParseLength(length)
  local val, unit = osm2pgsql.split_unit(length, '')
  if val then
    if unit == 'cm' then
      val = val / 100
    end
    return val
  end
end
