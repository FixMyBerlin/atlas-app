require("Metadata")

function IntoExcludeTable(table, object, reason)
  if os.getenv('DEBUG') == 1 then
    table:insert({
      tags = object.tags,
      meta = Metadata(object),
      reason = reason,
      geom = object:as_linestring()
    })
  end
end
