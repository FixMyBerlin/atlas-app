local streetsTable = osm2pgsql.define_table({
  name = 'streets',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local excludedStreetsTable = osm2pgsql.define_table({
  name = 'streets_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',   type = 'jsonb' },
    { column = 'meta',   type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom',   type = 'linestring' },
  }
})


function osm2pgsql.process_way(object)
  local tags = object.tags
  if not tags.highway then return end

  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  -- Values that we would allow, but skip here:
  -- "construction", "planned", "proposed", "platform" (Haltestellen),
  -- "rest_area" (https://wiki.openstreetmap.org/wiki/DE:Tag:highway=rest%20area)
  if not allowed_highways[tags.highway] then return end

  local exclude, reason = ExcludeHighways(tags)
  if exclude then
    IntoExcludeTable(excludedStreetsTable, object, reason)
    return
  end
  local exclude, _ = ExcludeByWidth(tags, 2.1)
  if exclude then
    tags.is_narrow = true
  else
    -- call lit, roadclassification
    if not HighwayClasses[tags.highway] then
      -- call surface quality
      if not PathClasses[tags.highway] then
        -- call maxspeed
      end
    end
  end
end
