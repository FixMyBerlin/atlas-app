package.path = package.path .. ";/processing/topics/helper/?.lua"
require('RemoveNilValues')
RoadTodo = {}
RoadTodo.__index = RoadTodo

-- @param args table
-- @param args.key string
-- @param args.desc string
-- @param args.conditions function
function RoadTodo.new(args)
  local self = setmetatable({}, RoadTodo)
  self.key = args.key
  self.desc = args.desc
  self.conditions = args.conditions
  return self
end

function RoadTodo:checkCondition(objectTags, resultTags)
  if self.conditions(objectTags, resultTags) then
    return self.key
  else
    return nil
  end
end

-- === Fahrradstraßen ===
local check_cycleway_shared = RoadTodo.new({
  key = "check_cycleway_shared",
  desc = "Tagging `cycleway=shared` is very old tagging and should be checked an maybe removed.",
  conditions = function(tagsObject, _)
    return tagsObject.cycleway == "shared"
  end
})


-- Public funtion
function RoadTodos(tagsObject, resultTags)
  local todos = {}

  todos[#todos + 1] = check_cycleway_shared:checkCondition(tagsObject, resultTags)

  return RemoveNilValues(todos)
end
