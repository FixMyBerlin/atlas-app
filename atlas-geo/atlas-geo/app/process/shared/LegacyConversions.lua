function LEGACY_opposite(tags)
    -- legacy one way scheme
  -- doesn't handle opposite tagging scheme on nested tags!
  if osm2pgsql.has_prefix(tags.cycleway, 'opposite') then
    if tags.oneway == 'yes' then
      tags['oneway:bicycle'] = tags['oneway:bicycle'] or 'no'
      local opposite_type = string.sub(tags.cycleway, 10)
      if opposite_type ~= '' then
        tags['cycleway:left'] = opposite_type
      end
      tags.cycleway = nil
    end
  end

end
