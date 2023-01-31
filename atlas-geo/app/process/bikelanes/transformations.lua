-- unnest all tags from ["prefix .. side:subtag"]=val -> ["subtag"]=val
local function unnestTags(tags, prefix, side, dest)
  dest = dest or {}
  dest.parent = tags
  local fullPrefix = prefix .. side
  for prefixedKey, val in pairs(tags) do
    if StartsWith(prefixedKey, fullPrefix) then
      dest.side = side
      if prefixedKey == fullPrefix then -- self projection
        dest[prefix] = val
      else
        -- offset of 2 due to 1-indexing and for removing the ':'
        local key = string.sub(prefixedKey, string.len(fullPrefix) + 2)
        dest[key] = val
      end
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
  tags.sign = 0
  local results = { tags }
  for _, transformation in pairs(transformations) do
    for side, sign in pairs(sides) do
      if tags.highway ~= transformation.highway then
        local prefix = transformation.prefix
        local newObj = {
          highway = transformation.highway,
          name = tags.name,
          prefix = prefix,
          sign = sign
        }
        -- we look for tags with the following hirachy: `prefix` < `prefix:both` < `prefix:side`
        -- thus a more specific tag will always overwrite a more general one
        unnestTags(tags, prefix, '', newObj)
        unnestTags(tags, prefix, ':both', newObj)
        unnestTags(tags, prefix, side, newObj)
        if newObj.side ~= nil then
          if not transformation.filter or transformation.filter(newObj) then
            table.insert(results, newObj)
          end
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
