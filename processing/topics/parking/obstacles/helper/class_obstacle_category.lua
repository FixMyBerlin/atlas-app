package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Log")

---@meta

---@class ObstacleCategory
class_obstacle_category = {}
class_obstacle_category.__index = class_obstacle_category

---@param args {
--- id: string,
--- side_key: string|nil, -- The OSM Key that has a value of "left|right|both"
--- perform_snap: '"side"'|'"self"', -- A mode for snapping. Must be "side" or "self".
--- perform_buffer: fun(tags: table):(number|nil), -- Radius in meters for adding a buffer.
--- tags: fun(tags: table):(table), -- Tags which have to be sanitized in the category.
--- tags_cc: table, -- Tags which will be prefixed with "osm_" and copied as is.
--- conditions: fun(tags: table): boolean }
function class_obstacle_category.new(args)
  ---@class ObstacleCategory
  local self = setmetatable({}, class_obstacle_category)

  -- Validate required fields
  assert(type(args.id) == "string", "id must be a string")
  assert(type(args.perform_snap) == "string" and (args.perform_snap == "side" or args.perform_snap == "self"), "perform_snap must be 'side' or 'self'")
  assert(type(args.perform_buffer) == "function", "perform_buffer must be a function")
  assert(type(args.tags) == "function", "tags must be a function")
  assert(type(args.tags_cc) == "table", "tags_cc must be a table")
  assert(type(args.conditions) == "function", "conditions must be a function")

  -- Assign fields
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
  self._last_tags = tags -- Store the tags internally
  return self.conditions(tags)
end

---@return number|nil
function class_obstacle_category:get_buffer()
  assert(self._last_tags, "Tags must be set by calling the object before using get_buffer")
  return self.perform_buffer(self._last_tags)
end

---@return table
function class_obstacle_category:get_tags()
  assert(self._last_tags, "Tags must be set by calling the object before using get_tags")
  return self.tags(self._last_tags)
end
