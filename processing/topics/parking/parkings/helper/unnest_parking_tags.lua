package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Log")
require("Set")

-- unnest all tags from `["prefix .. side:subtag"]=val` -> `["subtag"]=val`
---@param rawTags table
---@param infix string infix to look for either a side e.g. `:left`, `:right`, `:both` or `''`
---@param dest table
---@return table
function unnest_parking_tags(rawTags, infix, dest)
  if (not Set({ ':left', ':right', ':both', '' })[infix]) then return dest end

  local fullPrefix = "parking" .. infix
  local prefixLen = string.len(fullPrefix)
  for key, val in pairs(rawTags) do
    if osm2pgsql.has_prefix(key, fullPrefix) then
      if key == fullPrefix then
        -- Handle `parking:SIDE=`
        dest["parking"] = val
      else
        -- Handle `parking:SIDE:subkey=`
        -- offset of 2 due to 1-indexing and for removing the ':'
        local prefixlessKey = string.sub(key, prefixLen + 2)
        local subkey = string.match(prefixlessKey, '[^:]*')
        -- make sure that `subkey` is not an infix
        if infix ~= '' or not Set({ 'left', 'right', 'both' })[subkey] then
          dest[prefixlessKey] = val
        end
      end
    end
  end

  return dest
end
