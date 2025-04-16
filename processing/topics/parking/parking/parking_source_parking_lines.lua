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

  if transformed_objects.left ~= nil then
    table.insert(results, MergeTable({ geom = object:as_linestring() }, result_tags_parking_lines(transformed_objects.left)))
  end

  if transformed_objects.right ~= nil then
    table.insert(results, MergeTable({ geom = object:as_linestring() }, result_tags_parking_lines(transformed_objects.right)))
  end

  return results
end
