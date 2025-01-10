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
  self.priority = args.priority
  self.conditions = args.conditions
  return self
end

function RoadTodo:__call(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return { id = self.id, priority = self.priority() }
  else
    return nil
  end
end

-- === Deprecated cycleway tagging ===
local deprecated_cycleway_shared = RoadTodo.new({
  id = "deprecated_cycleway_shared",
  desc = "The tagging `cycleway=shared` is deprecated and should be replaced or removed.",
  priority = function(_, _) return "1" end,
  conditions = function(tagsObject, _)
    return tagsObject.cycleway == "shared"
  end
})

RoadTodos = {deprecated_cycleway_shared}
