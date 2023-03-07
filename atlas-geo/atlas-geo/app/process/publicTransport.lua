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
  if not object.tags.public_transport then
    return true
  end

  local shouldExit = false

  -- ["operator"!= "Berliner Parkeisenbahn"] - a smalll train in a park that we cannot propery exclude by other means
  if object.tags.operator == "Berliner Parkeisenbahn" then
    shouldExit = true
  end

  -- "station" includes "railway=yes" and "ferry=yes", "stop_position" includes "bus=yes"
  -- TODO for now we exclude "stop_position". We could include those, but need to clean the data so it's easy to filter by transportation mode (bus, train, ferry) and also for train, only include the station, not the stop_position.
  local allowed_values = Set({ "station" })
  if not allowed_values[object.tags.public_transport] then
    shouldExit = true
  end

  -- ["disused"!="yes"] - ignore all that are not in use
  if object.tags.disused == "yes" then
    shouldExit = true
  end

  return shouldExit
end

local function processTags(tags)
  local allowed_tags = Set({ "name", "public_transport", "operator", "railway", "bus", "ferry" })
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
