package.path = package.path .. ';/processing/topics/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/obstacles/helper/?.lua'
package.path = package.path .. ';/processing/topics/parking/obstacles/line/?.lua'
require('class_obstacle_category')
require('two_wheel_parking_helper')
require('amenity_parking_helper')
require('Log')

obstacle_line_categories = {
  class_obstacle_category.new({
    id = 'kerb_lowered', -- https://www.openstreetmap.org/way/814637433
    side_schema = nil,
    side_key = nil,
    perform_snap = 'self',
    perform_buffer = function(tags) return nil end,
    conditions = function(tags)
      return tags.barrier == 'kerb' and tags.kerb == 'lowered'
    end,
    tags = function(tags) return {
      barrier = tags.barrier,
      kerb = tags.kerb
    } end,
    tags_cc = { },
  }),
}
