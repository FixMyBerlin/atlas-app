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
--- conditions: fun(tags: table): (boolean) }
function class_obstacle_category.new(args)
  ---@class ObstacleCategory
  local self = setmetatable({}, class_obstacle_category)

  self.id = args.id
  self.side_key = args.side_key
  self.perform_snap = args.perform_snap
  self._perform_buffer = args.perform_buffer -- use category:get_perform_buffer(tags)
  self._tags = args.tags -- use category:get_tags(tags)
  self.tags_cc = args.tags_cc
  self._conditions = args.conditions -- use category:is_active(tags)

  return self
end

---@param tags table
---@return boolean
function class_obstacle_category:is_active(tags)
  return self._conditions(tags)
end

---@param tags table
---@return number|nil
function class_obstacle_category:get_perform_buffer(tags)
  return self._perform_buffer(tags)
end

---@return table
function class_obstacle_category:get_tags(tags)
  return self._tags(tags)
end
