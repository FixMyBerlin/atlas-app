function road_name(tags)
  return tags.name or tags.ref or tags['is_sidepath:of:name'] or tags['street:name']
end
