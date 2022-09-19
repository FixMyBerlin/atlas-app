package.path = package.path .. ";app/process/helper/?.lua"
require("AddUrl")

print('=== Test AddUrl ===')

local osm_type = "Z"
local object = { ["id"] = 33, ["tags"] = {} }

AddUrl(osm_type, object)

assert(object.tags.osm_url == "https://osm.org/Z/33")
