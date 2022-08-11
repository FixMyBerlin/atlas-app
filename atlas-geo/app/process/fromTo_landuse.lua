package.path = package.path .. ";/app/process/helper/?.lua"
require("Set")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeTable")
require("AddMetadata")
require("HasAreaTags")
require("AddUrl")

local table = osm2pgsql.define_table({
  name = 'fromTo_landuse',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'multipolygon' },
    { column = 'update_at', sql_type = 'timestamp' },
  }
})

local function ExitProcessing(object)
  if not (object.tags.landuse or object.tags.amenity) then
    return true
  end

  local allowed_values_landuse = Set({
    "allotments",
    "brownfield",
    "cemetery",
    "civic_admin",
    "civic",
    "commercial",
    "construction",
    "farmyard",
    "garages",
    "industrial",
    "religious",
    "residential",
    "retail"
  })
  local allowed_values_amenity = Set({
    "school",
    "university"
  })
  if not (allowed_values_landuse[object.tags.landuse] or allowed_values_amenity[object.tags.amenity]) then
    return true
  end

  return false
end

local function ProcessTags(object)
  -- For simplicy, we move the amenity values to the landuse key
  object.tags.landuse = object.tags.landuse or object.tags.amenity
  local allowed_tags = Set({ "name", "landuse", "access", "operator" })
  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  ProcessTags(object)
  AddUrl("way", object)

  table:insert({
    tags = object.tags,
    geom = object:as_polygon()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  ProcessTags(object)
  AddUrl("relation", object)

  table:insert({
    tags = object.tags,
    geom = object:as_multipolygon()
  })
end
