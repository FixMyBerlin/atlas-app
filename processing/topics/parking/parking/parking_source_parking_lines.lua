package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/parking/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_parking_lines")
require("exit_processing_parking_lines")
require("transform_parking_lines")

function parking_source_parking_lines(object)
  local results = {}

  if exit_processing_parking_lines(object.tags) then return results end

  local transformed_objects = transform_parking_lines(object)
  for _, transformed_object in ipairs(transformed_objects) do
    table.insert(results, MergeTable({ geom = object:as_linestring() }, result_tags_parking_lines(transformed_object)))
  end

  return results
end
