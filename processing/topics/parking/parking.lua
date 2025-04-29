package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/obstacles/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
package.path = package.path .. ";/processing/topics/parking/parkings/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/?.lua"
require("parking_obstacle_points")
require("parking_obstacle_areas")
require("parking_kerbs")
require("parking_parkings")
require("parking_roads")
require("parking_service_roads")
require("Log")

-- NOTE ON PROJECTIONS:

-- All `paring_*` tables use EPSG:5243
--  which is optimized for Germany and uses Meters
--  https://spatialreference.org/ref/epsg/5243/


function osm2pgsql.process_node(object)
  parking_obstacle_points(object)
end

function osm2pgsql.process_way(object)
  parking_obstacle_areas(object)

  parking_roads(object)

  parking_service_roads(object)

  parking_kerbs(object)

  parking_parkings(object)

end

-- function osm2pgsql.process_relation(object)
-- end
