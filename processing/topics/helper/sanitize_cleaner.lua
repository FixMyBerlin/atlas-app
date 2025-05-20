require('init')
require("sanitize_for_logging") -- DISALLOWED_VALUE
require("Clone") -- 'StructuredClone'
require("Log")

-- Returns cleaned_tags, replaced_tags (with _instruction if any replaced)
function sanitize_cleaner(tags_to_clean, object_tags)
  local cleaned_tags = {}
  local replaced_tags = {}

  for key, _ in pairs(tags_to_clean) do
    if tags_to_clean[key] == DISALLOWED_VALUE then
      replaced_tags[key] = object_tags[key]
    else
      cleaned_tags[key] = tags_to_clean[key]
    end
  end

  return cleaned_tags, replaced_tags
end
