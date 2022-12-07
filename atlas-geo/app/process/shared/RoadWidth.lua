function RoadWidth(tags)
  -- if tags["width"] ~= nil then
  --   return tonumber(string.gmatch(tags["width"], "[^%s;]+")())
  -- end
  -- if tags["est_width"] ~= nil then
  --   return tonumber(string.gmatch(tags["est_width"], "[^%s;]+")())
  -- end
  -- local streetWidths = {primary=10, secondary=8, tertiary=6, residential=6}
  -- if streetWidths[tags["highway"]] ~= nil then
  --   return streetWidths[tags["highway"]]
  -- end
  return 8
end
