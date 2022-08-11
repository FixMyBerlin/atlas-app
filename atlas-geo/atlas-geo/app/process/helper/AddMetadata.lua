function AddMetadata(object)
  object.tags.update_at = os.date('!%Y-%m-%dT%H:%M:%SZ', object.timestamp)
  -- 'user' not present in regular osm file
  object.tags.updated_by = object.user
  object.tags.version = object.version
end
