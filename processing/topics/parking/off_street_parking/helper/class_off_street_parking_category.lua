require('init')
require("Log")
local round = require('round')

---@meta

---@class OffStreetParkingCategory
class_off_street_parking_category = {}
class_off_street_parking_category.__index = class_off_street_parking_category

---@param args {
--- id: string,
--- conditions: fun(tags: table): (boolean),
--- tags: fun(tags: table):(table), -- Tags which have to be sanitized in the category.
--- tags_cc: table, -- Tags which will be prefixed with "osm_" and copied as is.
--- capacity_from_area: fun(tags: table, area: number):(table)|nil }
function class_off_street_parking_category.new(args)
  ---@class OffStreetParkingCategory
  local self = setmetatable({}, class_off_street_parking_category)
  self.id = args.id

  self._conditions = args.conditions -- use category:is_active(tags)
  self._tags = args.tags -- use category:get_tags(tags)
  self.tags_cc = args.tags_cc
  self._capacity_from_area = args.capacity_from_area -- use category:get_capacity_from_area(tags)

  return self
end

---@param tags table
---@return boolean
function class_off_street_parking_category:is_active(tags)
  return self._conditions(tags)
end

---@return table
function class_off_street_parking_category:get_tags(tags)
  return self._tags(tags)
end

---Returns a table representing an off-street parking category.
---@return table { area: number, capacity: number, capacity_confidence: "high"|"medium"|"low", capacity_source: string }
function class_off_street_parking_category:get_capacity_from_area(tags, area)
  if type(tonumber(tags.capacity)) == "number" then
    return {
      area = round(area, 2),
      capacity = tonumber(tags.capacity),
      capacity_confidence = 'high',
      capacity_source = 'tag',
    }
  end

  return self._capacity_from_area(tags, area)
end
