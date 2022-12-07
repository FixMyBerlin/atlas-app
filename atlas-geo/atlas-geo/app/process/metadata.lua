package.path = package.path .. ";/app/process/helper/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("Metadata")


local table = osm2pgsql.define_table({
  name = 'metadata',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'point' },
  }
})

-- Meta data table.
-- The content (the changing cities office) is just a placeholder.
-- We use this table to show metadata.
-- Right now that is only the processed_at date. See "run-3-process" for more.

function osm2pgsql.process_node(object)
  if not object.tags.office then return end

  if object.tags.name == "Changing Cities" then
    local allowed_tags = Set({ "name", "office", "operator" })
    FilterTags(object.tags, allowed_tags)

    table:insert({
      tags = object.tags,
      meta = Metadata(object),
      geom = object:as_point()
    })
  end
end
