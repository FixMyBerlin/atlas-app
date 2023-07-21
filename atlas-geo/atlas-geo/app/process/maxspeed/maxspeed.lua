package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/maxspeed/?.lua"
require("ExcludeHighways")
require("FilterTags")
require("HighwayClasses")
require("IntoExcludeTable")
require("IsFresh")
require("JoinSets")
require("MaxspeedDirect")
require("MaxspeedFromZone")
require("Metadata")
require("Set")

local table = osm2pgsql.define_table({
  name = "maxspeed",
  ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
  columns = {
    { column = "tags", type = "jsonb" },
    { column = "meta", type = "jsonb" },
    { column = "geom", type = "linestring" }
  }
})

-- Roads that we exlude from our analysis
local excludeTable = osm2pgsql.define_table({
  name = "maxspeed_excluded",
  ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
  columns = {
    { column = "tags",   type = "jsonb" },
    { column = "meta",   type = "jsonb" },
    { column = "reason", type = "text" },
    { column = "geom",   type = "linestring" }
  }
})

-- Define tables with all bicycle related roads that currently dont have speed values
local missingTable = osm2pgsql.define_table({
  name = "_maxspeed_missing",
  ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
  columns = {
    { column = "tags", type = "jsonb" },
    { column = "meta", type = "jsonb" },
    { column = "geom", type = "linestring" }
  }
})

function osm2pgsql.process_way(object)
  local allowed_highways = JoinSets({ MajorRoadClasses, MinorRoadClasses })
  if not allowed_highways[object.tags.highway] then
    return
  end

  local tags = object.tags
  tags.raw_maxspeed = tags.maxspeed -- Preserve original value since we use `maxspeed` for our processed data

  local exclude, reason = ExcludeHighways(tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  -- TODO: Why would we want to exclude this based on this tag? (Tobias)
  -- if tags.bicycle == "no" then
  --   IntoExcludeTable(table, object, "no bikes allowed")
  --   return
  -- end

  -- Try to find maxspeed information in the following order:
  -- 1. `maxspeed` tag
  -- 2. maxspeed zones tags
  -- 3. highway type
  -- 4. SQL: intersecting landuse
  local maxspeed, source, confidence = MaxspeedDirect(tags)

  if maxspeed < 0 then
    maxspeed, source, confidence = MaxspeedFromZone(tags)
  end

  if maxspeed == nil or maxspeed == -1 then
    local highway_speeds = {
      ["living_street"] = 7
    }
    if highway_speeds[tags.highway] then
      maxspeed = highway_speeds[tags.highway]
      source = "inferred_from_highway"
      confidence = 'high' -- living_street is 'high', others would be 'medium
    end
  end

  -- all tags that are shown on the application
  local allowed_tags = {
    "_todo",
    "name",
    "highway",
    "bicycle_road",
    "raw_maxspeed",
    "maxspeed:backward",
    "maxspeed:forward",
    "maxspeed:conditional",
    "maxspeed:type",
    "zone:maxspeed",
    "source:maxspeed",
    "traffic_sign",
    "checkdate:maxspeed",
  }
  FilterTags(tags, Set(allowed_tags))

  -- Freshness of data (AFTER `FilterTags`!)
  IsFresh(object, "check_date:maxspeed", tags)

  tags.maxspeed = maxspeed
  tags.maxspeed_source = source
  tags.maxspeed_confidence = confidence

  local meta = Metadata(object)

  if maxspeed ~= nil and maxspeed ~= -1 then
    table:insert({
      tags = tags,
      meta = meta,
      geom = object:as_linestring(),
    })
    return
  end

  missingTable:insert({
    tags = object.tags,
    meta = meta,
    geom = object:as_linestring(),
  })
end
