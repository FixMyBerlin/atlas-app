function StructuredClone(original)
  if type(original) ~= "table" then
    return original -- Return non-table values as is
  end

  local copy = {}
  for key, value in pairs(original) do
    if type(value) == "table" then
      copy[key] = StructuredClone(value) -- Recursively clone nested tables
    else
      copy[key] = value
    end
  end
  return copy
end

-- Thanks to https://gist.github.com/tylerneylon/81333721109155b2d244#file-copy-lua-L77-L88
function MetaClone(obj)
    -- Handle non-tables and previously-seen tables.
    if type(obj) ~= 'table' then return obj end
    if seen and seen[obj] then return seen[obj] end

    -- New table; mark it as seen and copy recursively.
    local s = seen or {}
    local res = {}
    s[obj] = res
    for k, v in pairs(obj) do res[MetaClone(k, s)] = MetaClone(v, s) end
    return setmetatable(res, getmetatable(obj))
end
