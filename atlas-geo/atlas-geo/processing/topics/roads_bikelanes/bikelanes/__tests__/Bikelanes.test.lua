package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/?.lua"
require("osm2pgsql")
require("Bikelanes")

print("=== Test Bikelanes ===")

print('=== Test Bikelanes: Centerline width ===')
local input_object = {
  tags = {
    highway = 'residential',
    width = '5 m',
    bicycle_road = 'yes',
  }
}
local result = Bikelanes(input_object)
local result_string = ''
for sideKey, side in pairs(result) do
  for key, value in pairs(side) do
    result_string = result_string .. sideKey .. ':' .. key .. '=' .. tostring(value) .. '__' .. type(value) .. '/'
  end
end
print(result_string)
-- '1:_infrastructureExists=true__boolean/1:category=bicycleRoad__string/1:oneway=assumed_no__string/1:width=5__number/1:offset=0.0__number/1:sign=0__number/'
assert(string.match(result_string, "1:category=bicycleRoad__string") ~= nil)
assert(string.match(result_string, "1:width=5__number") ~= nil)

print("=== Test Bikelanes: Transformed geometry width ===")
local input_object = {
  tags = {
    highway = 'residential',
    width = '10 m',
    ['cycleway:left'] = 'track',
    ['cycleway:left:width'] = '5 m',
  }
}
local result = Bikelanes(input_object)
local result_string = ''
for sideKey, side in pairs(result) do
  for key, value in pairs(side) do
    if type(value) ~= 'table' then
      result_string = result_string .. sideKey .. ':' .. key .. '=' .. tostring(value) .. '__' .. type(value) .. '/'
    end
  end
end
print(result_string)
-- 2:category=cycleway_adjoining__string/2:sign=1__number/2:_infrastructureExists=true__boolean/2:highway=cycleway__string/2:offset=5.0__number/2:side=:left__string/2:prefix=cycleway__string/2:width=5__number/2:oneway=assumed_no__string/2:cycleway=track__string/2:_parent_highway=residential__string/
assert(string.match(result_string, "2:category=cycleway_adjoining__string") ~= nil)
assert(string.match(result_string, "2:category=cycleway_adjoining") ~= nil)
assert(string.match(result_string, "2:width=5__number") ~= nil)
