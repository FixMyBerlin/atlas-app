package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("InferAddress")
require("MergeArray")
require("Metadata")

local table = osm2pgsql.define_table({
  name = 'education',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local function ExitProcessing(object)
  if not object.tags.amenity then
    return true
  end

  local allowed_values = Set({
    "childcare",
    "college",
    "kindergarten",
    "research_institute",
    "school",
    "university"
  })
  if not allowed_values[object.tags.amenity] then
    return true
  end

  return false
end

local function processTags(tags)
  InferAddress(tags, tags)
  local allowed_tags = MergeArray({ "name", "amenity" }, AddressKeys)
  FilterTags(tags, Set(allowed_tags))
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
  if ExitProcessing(object) or not object.is_closed then
    return
  end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) or not object.tags.type == 'multipolygon' then
    return
  end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
