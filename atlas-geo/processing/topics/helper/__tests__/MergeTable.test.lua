package.path = package.path .. ";/processing/topics/helper/?.lua"
require("MergeTable")

print('=== Test MergeTable ===')

local base = { ["base"] = "base" }

-- Default
local merge = { ["merge"] = "merge" }
local result = MergeTable(base, merge)
local base_string = ""
for key, value in pairs(base) do
  base_string = base_string .. key .. value
end
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(base_string == result_string)

-- Emtpy merge table
local merge = {}
local result = MergeTable(base, merge)
local base_string = ""
for key, value in pairs(base) do
  base_string = base_string .. key .. value
end
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(base_string == result_string)

-- nil merge
local merge = nil
local result = MergeTable(base, merge)
local base_string = ""
for key, value in pairs(base) do
  base_string = base_string .. key .. value
end
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(base_string == result_string)
