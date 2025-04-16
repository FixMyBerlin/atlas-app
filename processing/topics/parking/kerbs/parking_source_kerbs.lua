package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/?.lua"
package.path = package.path .. ";/processing/topics/parking/kerbs/helper/?.lua"
require("Log")
require("MergeTable")
require("result_tags_kerbs")
require("exit_processing")
require("transform_kerbs")

function parking_source_kerbs(object)
  local results = {}

  if exit_processing(object.tags) then return results end

  local transformed_objects = transform_kerbs(object)
  for _, transformed_object in ipairs(transformed_objects) do
    table.insert(results, MergeTable({ geom = object:as_linestring() }, result_tags_kerbs(transformed_object)))
  end

  return results
end
