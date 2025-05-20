package.path = package.path .. ';/processing/topics/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/off_street_parking/helper/?.lua'
require('class_off_street_parking_category')

local off_street_parking_point_categories = {
  class_off_street_parking_category.new({
    id = 'bicycle_parking',
    conditions = function(tags) return false end,
    tags = function(tags) return {} end,
    tags_cc = {},
  }),
}

return off_street_parking_point_categories
