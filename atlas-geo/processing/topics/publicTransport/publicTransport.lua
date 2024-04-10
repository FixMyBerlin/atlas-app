package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Set")
require("CopyTags")
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
  -- ["operator"!= "Berliner Parkeisenbahn"] - a smalll train in a park that we cannot propery exclude by other means
  if object.tags.operator == "Berliner Parkeisenbahn" then
    return true
  end

  -- ["disused"!="yes"] - ignore all that are not in use
  if object.tags.disused == "yes" then
    return true
  end

  local allowed_tags = Set({
    "tram_stop",
    "station",
    "halt",
  })
  if allowed_tags[object.tags.railway] or object.tags.amenity == "ferry_terminal" then
    return false
  end

  return true
end

local function processTags(tags)
  local category

  -- Bahn
  -- Precedence: Has to come first so others can overwrite with more precise values.
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dstation
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dhalt
  if (tags.railway == "station" or tags.railway == "halt") then
    category = "railway_station"
  end

  -- Ferry
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:amenity%3Dferry_terminal
  -- https://wiki.openstreetmap.org/wiki/DE:Key:ferry
  if (tags.amenity == "ferry_terminal") then
    category = "ferry_station"
  end

  -- U-Bahn
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:station%3Dsubway
  if (tags.station == "subway") then
    category = "subway_station"
  end

  -- S-Bahn
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dlight_rail
  if (tags.station == "light_rail") then
    category = "light_rail_station"
  end

  -- Straßenbahn
  -- https://wiki.openstreetmap.org/wiki/DE:Tag:railway%3Dtram_stop
  if (tags.railway == "tram_stop") then
    category = "tram_station"
  end

  -- Bus:
  -- We don't handle bus stops ATM because they are not too relevant for our use cases.
  -- We might add them later…

  if (category == nil) then
    -- We need to check those and either filter them or fix the categories
    category = "undefined"
  end

  -- these tags are copied (Eigennamen)
  local allowed_tags = {
    "name",
    "operator",
  }
  -- these tags are copied and prefixed with `osm_`
  -- we need to sanatize them at some point
  local tags_cc = {
    "network",
    "network:short",
  }
  local result = { category = category }
  CopyTags(result, tags, tags_cc, 'osm_')
  CopyTags(result, tags, allowed_tags)

  return result
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) then return end
  if not object.is_closed then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  table:insert({
    tags = processTags(object.tags),
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
