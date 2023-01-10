-- This file defines the `Transformations` which are used to process center line tagged bike lanes
-- `highway` is the new highway type for the generated object
-- `prefix` will be concatinated wiht one of the sides `':left' | ':right' | ':both' | '' `
-- all tags wich have the concatination as a preix get projected -> w\o prefix
-- postProcessing() gets called before inserting the transformed object into the table and has the following params:
-- `parent` (tags of original object)
-- `cycleway` (transformed object)
-- `category` the category of the transformed cycleway
-- return an int which gets added onto the offset value

require("PrintTable")


-- transform all tags from ["prefix:subtag"]=val -> ["subtag"]=val
local function transformTags(tags, side, transformation)
  local prefix = transformation.prefix
  local prefixedSide = prefix .. side
  if tags[prefixedSide] == nil then
    return
  end

  local transformedTags = {
    highway = transformation.highway,
    [prefix] = tags[prefixedSide], -- self projection
    _projected_to = prefix,
    _projected_from = prefixedSide,
  }
  for prefixedKey, val in pairs(tags) do
    if prefixedKey ~= prefixedSide and StartsWith(prefixedKey, prefixedSide) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key = string.sub(prefixedKey, string.len(prefixedSide) + 2)
      transformedTags[key] = val
    end
  end
  return transformedTags
end


function GetTransformedObjects(object, transformations)
  local sides = {
    [":right"] = { -1 },
    [":left"] = { 1 },
    [":both"] = { -1, 1 },
    [""] = { -1, 1 },
  }
  local transformedObjects = {};
  for _, transformation in pairs(transformations) do
    for side, signs in pairs(sides) do

      for _, sign in pairs(signs) do
      -- PrintTable(signs)
      -- this is the transformation:
        local cycleway = transformTags(object.tags, side, transformation)
        if cycleway ~= nil then
          cycleway.sign = sign
          table.insert(transformedObjects, cycleway)
        end
      end
    end
  end
  return transformedObjects
end
