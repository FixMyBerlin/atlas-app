package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
require("Log")
require("MergeTable")
require("JoinSets")
require("RoadClassification")
require("HighwayClasses")
require("categorize_and_transform_points")
require("result_tags_kerbs")
require("exit_processing")
require("transform_kerbs")

function parking_source_kerbs(object)
  local results = {}

  if exit_processing(object.tags) then return results end

  local objects = transform_kerbs(object)

  if objects.object then
    table.insert(objects, MergeTable({ geom = objects:as_linestring() }, result_tags_kerbs(objects)))
  end

  return objects
end
