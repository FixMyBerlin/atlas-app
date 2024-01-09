package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("MergeArray")
require("Metadata")


local table = osm2pgsql.define_table({
  name = 'publicTransport',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local function ExitProcessing(object)
  local isFerryStopPosition = object.tags.public_transport == "platform" and object.tags.ferry == "yes"
  if not (object.tags.railway or isFerryStopPosition) then
    return true
  end

  -- ["operator"!= "Berliner Parkeisenbahn"] - a smalll train in a park that we cannot propery exclude by other means
  if object.tags.operator == "Berliner Parkeisenbahn" then
    return true
  end

  -- ["disused"!="yes"] - ignore all that are not in use
  if object.tags.disused == "yes" then
    return true
  end

  return false
end

local function processTags(tags)
  local isFerryStopPosition = tags.public_transport == "platform" and tags.ferry == "yes"
  if (isFerryStopPosition) then
    tags.category = "ferry_station"
  end

  -- https://wiki.openstreetmap.org/wiki/DE:Tag:station%3Dsubway
  if (tags.railway == "subway") then
    tags.category = "subway_station"
  end

  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dtram_stop
  if (tags.railway == "tram_stop") then
    tags.category = "tram_station"
  end

  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dstation
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dhalt
  if (tags.railway == "station" or tags.railway == "halt") then
    tags.category = "railway_station"
  end

  -- NOTE ON BUS:
  -- We don't handle bus stops ATM because they are not too relevant for our use cases.
  -- We might add them later…

  if (tags.category == nil) then
    -- We need to check those and either filter them or fix the categories
    tags.category = "undefined"
  end

  -- TODO: Copy the tags below with prefix and add those as normized tags
  local allowed_tags = Set({
    "name",     -- Eigenname
    "operator", -- Eigenname
    "category",
  })
  FilterTags(tags, allowed_tags)
  --
  local tags_cc = Set({
    "network",
    "network:short",
    "railway",
    "light_rail",
    "bus",
    "ferry",
  })
  -- TODO: Copy tags with "osm_"-prefix
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
