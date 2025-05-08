package.path = package.path .. ";/processing/topics/helper/?.lua"
require('MergeTable')
require('HighwayClasses')

centerline_transformation_class = {}
centerline_transformation_class.__index = centerline_transformation_class

---@param args table
--@param args.prefix string
--@param args.direction_reference 'self' | 'parent'
--@param args.filter function?
--@return table
function centerline_transformation_class.new(args)
  local self = setmetatable({}, centerline_transformation_class)
  local mandatory = { 'prefix' }
  for k, v in pairs(mandatory) do
    if args[v] == nil then
      error('Missing mandatory argument ' .. v .. ' for CenterLineTransformation')
    end
    self[v] = args[v]
  end
  return self
end

-- unnest all tags from `["prefix .. side:subtag"]=val` -> `["subtag"]=val`
---@param tags table
---@param prefix string prefix to look for e.g. `cycleway`
---@param infix string? infix to look for either a side e.g. `:left`, `:right`, `:both` or `''`
---@param dest table? destination table to write to
---@return table
local function unnest_prefixed_tags(tags, prefix, infix, dest)
  dest = dest or {}
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

---@class TransformedObject
---@field _prefix string
---@field _side string
---@field _parent_tags table
---@field _parent_highway string
---@field _infix string?
---@field [string] any

---@class TransformationResults
---@field centerline table
---@field left TransformedObject?
---@field right TransformedObject?
---@field [string] TransformedObject?

---Transforms tags based on the provided transformations.
---@param tags table
---@param transformations table
---@return TransformationResults
function transform_objects(tags, transformations)
  local results = {
    centerline = {
      tags = tags
    },
    left = nil,
    right = nil,
  }
  for _, transformation in ipairs(transformations) do
    for _, side in ipairs({ "left", "right" }) do
      local prefix = transformation.prefix
      local newObj = {
        _prefix = prefix,
        _side = side,
        _parent_tags = tags,
        _parent_highway = tags.highway,
      }

      -- We look for tags with the following hierarchy: `prefix:side` > `prefix:both` > `prefix`
      -- thus a more specific tag will always overwrite a more general one
      unnest_prefixed_tags(tags, prefix, '', newObj)
      unnest_prefixed_tags(tags, prefix, ':both', newObj)
      unnest_prefixed_tags(tags, prefix, ':' .. side, newObj)

      -- This condition checks if we actually projected something
      if newObj._infix ~= nil then
        results[side] = newObj
      end
    end
  end

  return results
end
