require('init')
require("Log")

---@meta

---@class OffStreetParkingCategory
class_off_street_parking_category = {}
class_off_street_parking_category.__index = class_off_street_parking_category

---@param args {
--- id: string,
--- tags: fun(tags: table):(table), -- Tags which have to be sanitized in the category.
--- tags_cc: table, -- Tags which will be prefixed with "osm_" and copied as is.
--- conditions: fun(tags: table): (boolean) }
function class_off_street_parking_category.new(args)
  ---@class OffStreetParkingCategory
  local self = setmetatable({}, class_off_street_parking_category)
  self.id = args.id

  self._tags = args.tags -- use category:get_tags(tags)
  self.tags_cc = args.tags_cc
  self._conditions = args.conditions -- use category:is_active(tags)

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
