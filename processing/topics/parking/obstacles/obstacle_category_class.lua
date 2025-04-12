obstacle_category_class = {}
obstacle_category_class.__index = obstacle_category_class

-- @param args table
-- @param args.source string
-- @param args.side string (enum: left|right|center|self)
-- @param args.side_key string|nil
-- @param args.perform_move boolean
-- @param args.perform_buffer number|nil (in meters)
-- @param args.further_tags table|nil
-- @param args.conditions function
function obstacle_category_class.new(args)
  local self = setmetatable({}, obstacle_category_class)
  self.source = args.source
  self.side = args.side
  self.side_key = args.side
  self.side_key = args.side_key
  self.perform_move = args.perform_move
  self.perform_buffer = args.perform_buffer
  self.further_tags = args.further_tags or {}
  self.conditions = args.conditions
  return self
end

function obstacle_category_class:__call(tags)
  return self.conditions(tags)
end
