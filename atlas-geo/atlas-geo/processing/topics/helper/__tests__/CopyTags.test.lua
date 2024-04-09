package.path = package.path .. ";/processing/topics/helper/?.lua"
require("CopyTags")

print('=== Test CopyTags ===')

local src = { ["tag1"] = "tag1", ["tag2"] = "tag2", ["tag3"] = "tag3" }
local tags = { "tag1" }

-- Default, empty dst
local result = CopyTags({}, src, tags)
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(result_string == "tag1tag1")

-- Default, given dst
local result = CopyTags({ ["dst"] = "dst" }, src, tags)
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
print('WARN: This test is flaky. It fails randomly but works right after.')
assert(result_string == "dstdsttag1tag1" or result_string == "tag1tag1dstdst")

-- Default, with prefix
local result = CopyTags({ ["dst"] = "dst" }, src, tags, 'PRE_')
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(result_string == "dstdstPRE_tag1tag1")

-- Default, emtpy tags
local result = CopyTags({ ["dst"] = "dst" }, src, {}, 'PRE_')
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(result_string == "dstdst")

-- Default, empty src
local result = CopyTags({ ["dst"] = "dst" }, {}, tags, 'PRE_')
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(result_string == "dstdst")

-- Default, nil src
local tags = { "tag1" }
local result = CopyTags({ ["dst"] = "dst" }, nil, tags, 'PRE_')
local result_string = ""
for key, value in pairs(result) do
  result_string = result_string .. key .. value
end
assert(result_string == "dstdst")
