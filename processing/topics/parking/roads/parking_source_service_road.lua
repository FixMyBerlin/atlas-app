package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_roads")
require("exit_processing_service_roads")

function parking_source_service_road(object)
  if exit_processing_service_roads(object.tags) then return nil end

  return MergeTable({ geom = object:as_linestring() }, result_tags_roads(object))
end
