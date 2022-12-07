package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("ExtractKeys")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("Metadata")

-- Shared:
require("ShoppingAllowedListWithCategories")

-- We look at shop=* and amenity=<allowed_values>. We also `category`ze each into one of 4 categories for filtering.
local table = osm2pgsql.define_table({
  name = 'poiClassification',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'point' },
  }
})

-- Guards extracted to be used inside osm2pgsql.process_*
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
local function processTags(tags)
  -- Set our custom `category` value with one of our 4 values.
  -- We also introduce `type` as a unified way to speicify the shop-or-amenity type.
  if tags.shop then
    tags.category = 'shopping'
    tags.type = "shop-" .. tags.shop
  end
  if tags.amenity then
    tags.category = ShoppingAllowedListWithCategories[tags.amenity]
    tags.type = "amenity-" .. tags.amenity
  end

  local allowed_addr_tags = AddAddress(tags)
  local allowed_tags = Set(MergeArray({ "name", "category", "type" }, allowed_addr_tags))
  FilterTags(tags, allowed_tags)
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
