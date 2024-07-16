require("ParseLength")

-- * @desc TODO
-- * @returns TODO
function RoadWidth(tags)
  local width = tags["width"] or tags["est_width"]
  if width then
    width = ParseLength(width)
    if width then return width end
  end

  local streetWidths = {
    primary = 10,
    secondary = 8,
    tertiary = 6,
    residential = 6,
  }
  if streetWidths[tags["highway"]] then
    return streetWidths[tags["highway"]]
  end

  return 8
end
