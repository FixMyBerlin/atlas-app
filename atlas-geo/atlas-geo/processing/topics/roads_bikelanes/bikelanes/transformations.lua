package.path = package.path .. ";/processing/topics/helper/?.lua"
require('MergeTable')
require('HighwayClasses')

-- unnest all tags from ["prefix .. side:subtag"]=val -> ["subtag"]=val
local function unnestTags(tags, prefix, infix, dest)
  dest = dest or {}
  dest._parent = tags
  local fullPrefix = prefix .. infix
  local prefixLen = string.len(fullPrefix)
  for key, val in pairs(tags) do
    if osm2pgsql.has_prefix(key, fullPrefix) then
      if key == fullPrefix then -- self projection
        dest[prefix] = val
        dest._infix = infix
      else
        -- offset of 2 due to 1-indexing and for removing the ':'
        local prefixlessKey = string.sub(key, prefixLen + 2)
        local subkey = string.match(prefixlessKey, '[^:]*')
        -- make sure that `subkey` is not an infix
        if infix ~= '' or not Set({ 'left', 'right', 'both' })[subkey] then
          dest[prefixlessKey] = val
          dest._infix = infix
        end
      end
    end
  end
  return dest
end

SideSignMap = {
  ["left"] = 1,
  ["right"] = -1,
  ["self"] = 0
}
-- https://wiki.openstreetmap.org/wiki/Forward_%26_backward,_left_%26_right
local sideDirectionMap = {
  ["left"] = 'backward',
  ["right"] = 'forward',
}


-- these tags get transformed from the forward backward schema
local directedTags = { 'cycleway:lanes', 'bicycle:lanes' }
function GetTransformedObjects(tags, transformations)
  local center = MergeTable({}, tags)
  center._side = "self"                             -- Overwrite any OSM tag 'sign'
  center._prefix = ""
  center.oneway = tags['oneway:bicycle'] or tags.oneway -- give `bicycle:oneway` precedence

  local results = { center }

  -- don't transform paths
  if PathClasses[tags.highway] or tags.highway == 'pedestrian' then
    return results
  end

  for _, transformation in ipairs(transformations) do
    for _, side in ipairs({"left", "right"}) do
      if tags.highway ~= transformation.highway then
        local prefix = transformation.prefix
        local newObj = {
          _prefix = prefix,
          _side = side,
          _parent_highway = tags.highway,
          highway = transformation.highway

        }

        -- we look for tags with the following hirachy: `prefix:side` > `prefix:both` > `prefix`
        -- thus a more specific tag will always overwrite a more general one
        unnestTags(tags, prefix, '', newObj)
        unnestTags(tags, prefix, ':both', newObj)
        unnestTags(tags, prefix, ':' .. side , newObj)

        -- this condition checks wether we acutally projected something
        if newObj._infix ~= nil then
          if not transformation.filter or transformation.filter(newObj) then
            table.insert(results, newObj)
          end
        end
        for _, key in pairs(directedTags) do
          local directedKey = key .. ':' .. sideDirectionMap[side]
          newObj[key] = newObj[key] or tags[key] or tags[directedKey]
        end
      end
    end
  end

  return results
end
