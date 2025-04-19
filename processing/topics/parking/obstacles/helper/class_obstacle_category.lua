---@meta

---@class ObstacleCategory
class_obstacle_category = {}
class_obstacle_category.__index = class_obstacle_category

---@param args {
--- id: string,
--- side_key: string|nil, -- The OSM Key that has a value of "left|right|both"
--- perform_snap: '"side"'|'"self"', -- A mode for snapping. Must be "side" or "self".
--- perform_buffer: number|nil, -- Radius in meters for adding a buffer.
--- tags: table, -- Tags which have to be sanitized in the category.
--- tags_cc: table, -- Tags which will be prefixed with "osm_" and copied as is.
--- conditions: fun(tags: table): boolean }
function class_obstacle_category.new(args)
  ---@class ObstacleCategory
  local self = setmetatable({}, class_obstacle_category)
  self.id = args.id
  self.side_key = args.side_key
  self.perform_snap = args.perform_snap
  self.perform_buffer = args.perform_buffer
  self.tags = args.tags
  self.tags_cc = args.tags_cc
  self.conditions = args.conditions
  return self
end

---@param tags table
---@return boolean
function class_obstacle_category:__call(tags)
  return self.conditions(tags)
end
