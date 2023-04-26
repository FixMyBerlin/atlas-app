-- @desc Copy a table recursively
function DeepCopy(orig)
  local copy
  if type(orig) == 'table' then
    copy = {}
    for k, v in next, orig, nil do
      copy[DeepCopy(k)] = DeepCopy(v)
    end
    setmetatable(copy, DeepCopy(getmetatable(orig)))
  else -- number, string, boolean, etc
    copy = orig
  end
  return copy
end
