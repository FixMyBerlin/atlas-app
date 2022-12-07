package.path = package.path .. ";app/process/helper/?.lua"


print('=== Test AddUrl ===')

local osm_type = "way"
local object = { ["id"] = 33, ["tags"] = {} }

AddUrl(osm_type, object)

assert(object.tags.osm_url == "https://osm.org/way/33")
