

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

-- cycleway transformer:
local cyclewayTransformation = {
  highway = "cycleway",
  prefix = "cycleway",
}

Transformations = { footwayTransformation, cyclewayTransformation }
