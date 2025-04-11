package.path = package.path .. ";/processing/topics/helper/?.lua"
local inspect = require("inspect")

obstacle_category = {}
obstacle_category.__index = obstacle_category

-- @param args table
-- @param args.source string
-- @param args.side string (enum: left|right|center|self)
-- @param args.perform_move boolean
-- @param args.perform_buffer number|nil (in meters)
-- @param args.further_tags table|nil
-- @param args.conditions function
function obstacle_category.new(args)
  local self = setmetatable({}, obstacle_category)
  self.source = args.source
  self.side = args.side
  self.perform_move = args.perform_move
  self.perform_buffer = args.perform_buffer
  self.further_tags = args.further_tags or {}
  self.conditions = args.conditions
  return self
end

local function is_obstacle(tags)
  return tags['obstacle:parking'] == 'yes'
end

function obstacle_category:__call(tags)
  return is_obstacle(tags) and self.conditions(tags)
end

local obstacle_categories = {
  obstacle_category.new({
    source = "barrier=bollard",
    side = "self",
    perform_move = false,
    perform_buffer = 0.3,
    further_tags = { "access" },
    conditions = function(tags)
      return tags.barrier == "bollard"
    end
  }),
  obstacle_category.new({
    source = "highway=street_lamp",
    side = "self",
    perform_move = false,
    perform_buffer = 0.4,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags.highway == "street_lamp"
    end
  }),
  obstacle_category.new({
    source = "natural=tree",
    side = "self",
    perform_move = false,
    perform_buffer = 1.5,
    further_tags = { "ref" },
    conditions = function(tags)
      return tags.natural == "tree" or tags.natural == "tree_stump"
    end
  }),
}

function categorize_obstacles(tags)
  for _, category in pairs(obstacle_categories) do
    if category(tags) then
      return category
    end
  end
  return nil
end
