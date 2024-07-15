package.path = package.path .. ";/processing/topics/helper/?.lua"
RoadTodo = {}
RoadTodo.__index = RoadTodo

-- @param args table
-- @param args.key string
-- @param args.desc string
-- @param args.conditions function
function RoadTodo.new(args)
  local self = setmetatable({}, RoadTodo)
  self.id = args.id
  self.desc = args.desc
  self.conditions = args.conditions
  return self
end

function RoadTodo:__call(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return self.id
  else
    return nil
  end
end

-- === Fahrradstraßen ===
local check_cycleway_shared = RoadTodo.new({
  id = "check_cycleway_shared",
  desc = "Tagging `cycleway=shared` is very old tagging and should be checked an maybe removed.",
  conditions = function(tagsObject, _)
    return tagsObject.cycleway == "shared"
  end
})

RoadTodos = {check_cycleway_shared}
