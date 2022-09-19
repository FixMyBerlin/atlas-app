package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("ExtractKeys")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")
-- Shared:
require("ShoppingAllowedListWithCategories")

-- We look at shop=* and amenity=<allowed_values>. We also `category`ze each into one of 4 categories for filtering.
local table = osm2pgsql.define_table({
  name = 'fromTo_shopping',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

-- Guards extracted to be used inside projcess_*
-- @return `true` whenever we want to exit processing the given data
local function ExitProcessing(object)
  if not (object.tags.amenity or object.tags.shop) then
    return true
  end

  local shouldExit = false

  local allowed_values = Set(ExtractKeys(ShoppingAllowedListWithCategories))
  -- We allow all shop=* but heavily filter amenity
  if not allowed_values[object.tags.amenity] then
    shouldExit = true
  end
  -- Ignore all which are explicity restricted
  if object.tags.access == "private" then
    shouldExit = true
  end

  return shouldExit
end

-- Tag processing extracted to be used inside projcess_*
local function ProcessTags(object)
  -- Set our custom `category` value with one of our 4 values.
  -- We also introduce `type` as a unified way to speicify the shop-or-amenity type.
  if object.tags.shop then
    object.tags.category = 'shopping'
    object.tags.type = "shop-" .. object.tags.shop
  end
  if object.tags.amenity then
    object.tags.category = ShoppingAllowedListWithCategories[object.tags.amenity]
    object.tags.type = "amenity-" .. object.tags.amenity
  end

  local allowed_addr_tags = AddAddress(object.tags)
  local allowed_tags = Set(MergeArray({ "name", "category", "type" }, allowed_addr_tags))
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  ProcessTags(object)
  AddUrl("node", object)

  table:insert({
    tags = object.tags,
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  ProcessTags(object)
  AddUrl("way", object)

  table:insert({
    tags = object.tags,
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  ProcessTags(object)
  AddUrl("relation", object)

  table:insert({
    tags = object.tags,
    geom = object:as_multipolygon():centroid()
  })
end
