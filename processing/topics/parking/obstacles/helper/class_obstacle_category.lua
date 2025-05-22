require('init')
require("Log")
local capacity_from_tag = require('capacity_from_tag')
local round = require('round')

---@meta

---@class ObstacleCategory
class_obstacle_category = {}
class_obstacle_category.__index = class_obstacle_category

---@param args {
--- id: string,
--- side_schema: 'side_suffix'|'side_value'|'direction_key'|nil, -- The tagging schema used to encode the SIDE in the tag(s). Requires `side_key` and `perform_snap=side`. `side_suffix` is not implemented, yet.
--- side_key: string|nil, -- The OSM Key that has the value of "left|right|both"; nil=perform_snap=self (no side). For `direction_key` a prefixed `side_key` is needed like `_side_key_traffic_calming`. This will receive the SIDE value.
--- perform_snap: 'side'|'self', -- A mode for snapping. `side` will create one object per side.
--- perform_buffer: fun(tags: table):(number|nil), -- Radius in meters for adding a buffer or 0.
--- tags: fun(tags: table):(table), -- Tags which have to be sanitized in the category.
--- tags_cc: table, -- Tags which will be prefixed with "osm_" and copied as is.
--- conditions: fun(tags: table): (boolean),
--- apply_parking_capacity_fallback: boolean, -- The obstacles table holds read obstacles but also street parking data that was mapped separately. For those we want to add capacity data based on their area.
--- }
function class_obstacle_category.new(args)
  ---@class ObstacleCategory
  local self = setmetatable({}, class_obstacle_category)
  self.id = args.id

  self.side_schema = args.side_schema
  self.side_key = args.side_key

  self.perform_snap = args.perform_snap
  self._perform_buffer = args.perform_buffer -- use category:get_perform_buffer(tags)

  self._tags = args.tags -- use category:get_tags(tags)
  self.tags_cc = args.tags_cc
  self._conditions = args.conditions -- use category:is_active(tags)
  self.apply_parking_capacity_fallback = args.apply_parking_capacity_fallback -- use category:is_active(tags)

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

---Returns a table representing an off-street parking category.
---This class works
---@return nil|table { area: number, capacity: number, capacity_confidence: "high"|"medium"|"low", capacity_source: string }
function class_obstacle_category:get_capacity(tags, area)
  local tag = capacity_from_tag(tags, area)
  if tag ~= nil then return tag end

  if self.apply_parking_capacity_fallback == true then
    local factor = 14.5
    return {
      area = round(area, 2),
      capacity = round(area / factor, 0),
      capacity_confidence = 'medium',
      capacity_source = 'area',
    }
  end
  return nil
end
