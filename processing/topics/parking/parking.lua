package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
package.path = package.path .. ";/processing/topics/parking/parking/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/?.lua"
require("parking_source_obstacle_points")
require("parking_source_obstacle_areas")
require("parking_source_kerbs")
require("parking_source_parking_lines")
require("parking_source_road")
require("parking_source_service_road")
require("Log")

-- NOTE ON PROJECTIONS:
-- All `paring_*` tables use EPSG:5243
--  which is optimized for Germany and uses Meters
--  https://spatialreference.org/ref/epsg/5243/


function osm2pgsql.process_node(object)
  parking_source_obstacle_points(object)
end

function osm2pgsql.process_way(object)
  parking_source_obstacle_areas(object)

  parking_source_road(object)

  parking_source_service_road(object)

  parking_source_kerbs(object)

  parking_source_parking_lines(object)

end

-- function osm2pgsql.process_relation(object)
-- end
