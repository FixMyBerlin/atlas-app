-- unnest all tags from ["prefix:subtag"]=val -> ["subtag"]=val
local function unnestTags(tags, prefix, dest)
  dest = dest or {}
  dest.parent = tags
  for prefixedKey, val in pairs(tags) do
    if prefixedKey ~= prefix and StartsWith(prefixedKey, prefix) then
      -- offset of 2 due to 1-indexing and for removing the ':'
      local key = string.sub(prefixedKey, string.len(prefix) + 2)
      dest[key] = val
    end
  end
  return dest
end

-- returns a list of all transformed objects created with the given `transformations` from `tags`
LEFT_SIGN = 1
CENTER_SIGN = 0
RIGHT_SIGN = -1
function GetTransformedObjects(tags, transformations)
  local sides = {
    [":left"] = { LEFT_SIGN },
    [":right"] = { RIGHT_SIGN },
    [":both"] = { LEFT_SIGN, RIGHT_SIGN },
    [""] = { LEFT_SIGN, RIGHT_SIGN },
  }
  local transformedObjects = {}
  for _, transformation in pairs(transformations) do
    for side, signs in pairs(sides) do

      for _, sign in pairs(signs) do
        -- this is the transformation:
        local prefix = transformation.prefix
        local prefixedSide = prefix .. side
        if tags[prefixedSide] ~= nil and tags.highway ~= transformation.highway then -- check if tag exist
          local transformedObj = unnestTags(tags, prefixedSide)
          transformedObj.highway = transformation.highway
          transformedObj.name = tags.name -- copy name
          transformedObj[prefix] = tags[prefixedSide] -- self projection

          -- transformation meta data (some categories rely on this e.g. implicit oneway)
          transformedObj._projected_from = prefixedSide
          transformedObj._projected_to = prefix
          if not transformation.filter or transformation.filter(transformedObj) then
            transformedObj.sign = sign
            table.insert(transformedObjects, transformedObj)
          end
        end
      end
    end
  end
  return transformedObjects
end
