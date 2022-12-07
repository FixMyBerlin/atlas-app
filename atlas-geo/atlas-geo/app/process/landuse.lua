package.path = package.path .. ";/app/process/helper/?.lua"
require("Set")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("Metadata")
require("HasAreaTags")

local table = osm2pgsql.define_table({
  name = 'landuse',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'multipolygon' },
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
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  ProcessTags(object)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  ProcessTags(object)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon()
  })
end
