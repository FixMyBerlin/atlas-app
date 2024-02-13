package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("CopyTags")
require("Metadata")
require("Set")
require("Sanitize")

local nodeTable = osm2pgsql.define_table({
  name = 'bicycleParking_points',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local areaTable = osm2pgsql.define_table({
  name = 'bicycleParking_areas',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'polygon' },
  }
})

local function exitProcessing(object)
  if object.tags.amenity ~= 'bicycle_parking' then
    return true
  end
end

local function capacityNormalization(tags)
  local capacities = { capacity = tonumber(tags.capacity) }
  if capacities.capacity == nil then return capacities end
  for key, val in pairs(tags) do
    if osm2pgsql.has_prefix(key, "capacity:") then
      val = tonumber(val)
      if val ~= nil then
        capacities.capacity = capacities.capacity - val
        capacities[key] = val
      end
    end
  end
  for k, v in pairs(capacities) do
    if v == 0 then
      capacities[k] = nil
    end
  end
  return capacities
end

local function processTags(tags)
  -- this is the list of tags found in the wiki: https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dbicycle_parking
  -- also https://wiki.openstreetmap.org/wiki/Berlin/Verkehrswende/Fahrradparkpl%C3%A4tze
  local processedTags = capacityNormalization(tags)
  local binary = Set({ "yes", "no" })
  processedTags.access = Sanitize(tags.access, Set({ "yes", "private", "permissive", "customers" }))
  processedTags.covered = Sanitize(tags.covered, binary, "implicit_no")
  processedTags.fee = Sanitize(tags.fee, binary, "implicit_no")
  processedTags.access_cargo_bike = Sanitize(tags.cargo_bike, binary, "implicit_no")
  processedTags.bicycle_parking = Sanitize(
    tags.bicycle_parking,
    Set({ "stands", "wide_stands", "bollard", "wall_loops", "shed", "two-tier", "lockers" })
  )

  -- these tags are copied (Eigennamen)
  local allowed_tags = {
    "name",
    "operator",
  }
  -- these tags are copied and prefixed with `osm_`
  -- we need to sanatize them at some point
  local tags_cc = {
    "area", "operator:type", "covered", "indoor", "access", "cargo_bike", "capacity",
    "capacity:cargo_bike", "fee", "lit", "surface", "bicycle_parking", "maxstay", "surveillance",
    "bicycle_parking:count", "bicycle_parking:position", "traffic_sign", "description",
    "mapillary",
    "description",
  }
  CopyTags(processedTags, tags, allowed_tags)
  CopyTags(processedTags, tags, tags_cc, "osm_")

  processedTags.age = AgeInDays(ParseCheckDate(tags["check_date"]))

  return processedTags
end

function osm2pgsql.process_node(object)
  if exitProcessing(object) then return end
  local tags = processTags(object.tags)

  nodeTable:insert({
    tags = tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if exitProcessing(object) then return end
  local tags = processTags(object.tags)
  local meta = Metadata(object)

  -- convert bicycle parking mapped as lines or areas to points by taking the centroid
  nodeTable:insert({
    tags = tags,
    meta = meta,
    geom = object:as_polygon():centroid(),
  })

  if not object.is_closed then return end
  areaTable:insert({
    tags = tags,
    meta = meta,
    geom = object:as_polygon(),
  })
end
