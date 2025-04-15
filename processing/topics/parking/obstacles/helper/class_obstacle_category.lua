class_obstacle_category = {}
class_obstacle_category.__index = class_obstacle_category

-- @param args table
-- @param args.id string
-- @param args.side_key string|nil
-- @param args.perform_snap string (enum: side|self)
-- @param args.perform_buffer number|nil (in meters)
-- @param args.further_tags table|nil
-- @param args.conditions function
function class_obstacle_category.new(args)
  local self = setmetatable({}, class_obstacle_category)
  self.id = args.id
  self.side_key = args.side_key
  self.perform_snap = args.perform_snap
  self.perform_buffer = args.perform_buffer
  self.further_tags = args.further_tags or {}
  self.conditions = args.conditions
  return self
end

function class_obstacle_category:__call(tags)
  return self.conditions(tags)
end
