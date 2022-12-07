

-- This file defines the `Transformations` which are used to process center line tagged bike lanes
-- `highway` is the new highway type for the generated object
-- `prefix` will be concatinated wiht one of the sides `':left' | ':right' | ':both' | '' `
-- all tags wich have the concatination as a preix get projected -> w\o prefix
-- postProcessing() gets called before inserting the transformed object into the table and has the following params:
-- `parent` (tags of original object)
-- `cycleway` (transformed object)
-- `category` the category of the transformed cycleway
-- return an int which gets added onto the offset value

-- footway transformer: transforms all sidewalk:<side>:bicycle = val
local footwayTransformation = {
  highway = "footway",
  prefix = "sidewalk",
}

-- cycleway transformer: transforms all bicycle:<side> = val
local function cyclewayPP(category, cycleway, parent)
  if false and category == '' then -- For bike lanes on the street we want to infer surface quality and to reduce the offset
    cycleway["surface"] = parent["surface"]
    cycleway["smoothness"] = parent["smoothness"]
    return 1.5 -- TODO: base on  width
  end
  return 0
end

local cyclewayTransformation = {
  highway = "cycleway",
  prefix = "cycleway",
  postProcessing = cyclewayPP,-- for cycleways on streets surface and smoothness should match
}

Transformations = { footwayTransformation, cyclewayTransformation }
