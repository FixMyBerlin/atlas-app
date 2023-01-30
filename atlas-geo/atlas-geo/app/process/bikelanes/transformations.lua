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
    [":left"] = LEFT_SIGN,
    [":right"] = RIGHT_SIGN
  }
  local results = {}
  for _, transformation in pairs(transformations) do
    for side, sign in pairs(sides) do
      local prefix = transformation.prefix
      local newObj = {highway = transformation.highway, name = tags.name}
      unnestTags(tags, prefix, newObj)
      unnestTags(tags, prefix .. ":both", newObj)
      -- this is the transformation:
      local prefixedSide = prefix .. side
      if tags.highway ~= transformation.highway then -- check if tag exist
        unnestTags(tags, prefixedSide, newObj)
        if tags[prefixedSide] ~= nil then
          newObj[prefix] = tags[prefixedSide] -- self projection
        end
        -- transformation meta data (some categories rely on this e.g. implicit oneway)
        -- TODO: make this conditional on the result of unnestTags
        newObj._projected_from = prefixedSide
        newObj._projected_to = prefix

        if not transformation.filter or transformation.filter(newObj) then
          newObj.sign = sign
          table.insert(results, newObj)
        end


        -- DRAFT FOR LANES:
        -- if newObj.lanes == nil and false then
        --   -- TODO: this assumes right hand traffic (would be nice to have this as an option)
        --   if sign == RIGHT_SIGN then
        --     transformedObj['cycleway:lanes'] = transformedObj['cycleway:lanes:forward']
        --     transformedObj['bicycle:lanes'] = transformedObj['bicycle:lanes:forward']
        --   elseif sign == LEFT_SIGN then
        --     transformedObj['cycleway:lanes'] = transformedObj['cycleway:lanes:backward']
        --     transformedObj['bicycle:lanes'] = transformedObj['bicycle:lanes:backward']
        --   end
        -- end
      end
    end
  end
  return results
end
