package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("MergeArray")
require("Metadata")
require("HighwayClasses")
require("IsFresh")
require("ExcludeHighways")
require("JoinSets")
require("IntoExcludeTable")

-- The analysed road network, enriched with maxspeed information
local table =
    osm2pgsql.define_table(
      {
        name = "maxspeed",
        ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
        columns = {
          { column = "tags",     type = "jsonb" },
          { column = "meta",     type = "jsonb" },
          { column = 'maxspeed', type = 'integer' },
          { column = 'present',  type = 'boolean' },
          { column = "geom",     type = "linestring" }
        }
      }
    )

-- Roads that we exlude from our analysis
local excludeTable =
    osm2pgsql.define_table(
      {
        name = "maxspeed_excluded",
        ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
        columns = {
          { column = "tags",   type = "jsonb" },
          { column = "meta",   type = "jsonb" },
          { column = 'reason', type = 'text' },
          { column = "geom",   type = "linestring" }
        }
      }
    )

-- Define tables with all bicycle related roads that currently dont have speed values
local missingTable =
    osm2pgsql.define_table(
      {
        name = "_maxspeed_missing",
        ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
        columns = {
          { column = "tags", type = "jsonb" },
          { column = "meta", type = "jsonb" },
          { column = "geom", type = "linestring" }
        }
      }
    )


local function maxspeedDirect(tags)
  local maxspeed = -1.0
  local source = "nothing found"
  local speed_tags = { "maxspeed:forward", "maxspeed:backward", "maxspeed" }
  for _, tag in pairs(speed_tags) do
    if tags[tag] then
      local val = tonumber(tags[tag])
      if val ~= nil and val > maxspeed then
        source = tag
        maxspeed = val
      end
    end
  end
  return maxspeed, source
end

local function maxspeedFromZone(tags)
  local maxspeed_type = {
    ["DE:rural"] = 100,
    ["DE:urban"] = 50,
    ["DE:zone30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:zone20"] = 20,
    ["DE:zone10"] = 10,
  }

  local maxspeed_zone = {
    ["DE:30"] = 30,
    ["30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:20"] = 20,
    ["20"] = 20,
    ["DE:10"] = 10,
    ["10"] = 10,
  }

  -- maybe add also traffic signs to parse
  local maxspeed_source = {
    ["DE:rural"] = 100,
    ["DE:urban"] = 50,
    ["DE:zone:30"] = 30,
    ["DE:zone30"] = 30,
    ["DE:bicycle_road"] = 30,
    ["DE:zone:20"] = 20,
    ["DE:zone20"] = 20,
    ["DE:zone:10"] = 10,
    ["DE:zone10"] = 10,
  }
  if maxspeed_type[tags["maxspeed:type"]] then
    return maxspeed_type[tags["maxspeed:type"]], "maxspeed:type"
  end
  if maxspeed_zone[tags["zone:maxspeed"]] then
    return maxspeed_type[tags["zone:maxspeed"]], "zone:maxspeed"
  end
  if maxspeed_source[tags["source:maxspeed"]] then
    return maxspeed_source[tags["source:maxspeed"]], "source:maxspeed"
  end

  -- tbd think about conditional maxspeed
  -- if tags["maxspeed:conditional"] then
  --   return "Angabe mit Einschränkungen", "maxspeed:conditional"
  -- end

  return -1.0, "nothing found"
end


function osm2pgsql.process_way(object)
  local allowed_values = JoinSets({ MajorRoadClasses, MinorRoadClasses })
  if not allowed_values[object.tags.highway] then
    return
  end

  local meta = Metadata(object)
  local tags = object.tags

  local exclude, reason = ExcludeHighways(tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  if tags.bicycle == "no" then
    IntoExcludeTable(table, object, "no bikes allowed")
    return
  end

  -- OLD COMMENT
  --  - maxspeed = <zahl> inferred from source tag
  -- wenn maxspeed
  --  - maxspeed = <zahl>
  --  - _maxspeed_source = "maxspeed-tag"
  -- wenn kein maxspeed
  -- aber eines der source-tags, dann…
  --  - maxspeed = <zahl> inferred from source tag
  --  - _maxspec_source = "source tag"
  --  (szenarien de:urbuan, de:rural, bike_roads,  verschiedene zonen)

  -- try to find maxspeed information in the following order:
  -- `maxspeed` tag > maxspeed zones > highway type
  local maxspeed, source = maxspeedDirect(tags)
  if maxspeed < 0 then
    maxspeed, source = maxspeedFromZone(tags)
  end

  -- TODO: fallback option on highway type
  if maxspeed == nil or maxspeed == -1 then
    -- TODO: present no?
    local highway_speeds = {
      ["living_street"] = 7
    }
    if highway_speeds[tags.highway] then
      maxspeed = highway_speeds[tags.highway]
      source = "inferred from highway"
    end
  end

  -- all tags that are shown on the application
  local allowed_tags = Set(
    {
      "_todo",
      "bicycle_road",
      "bicycle",
      "cycleway",
      "name",
      "highway",
      "maxspeed",
      "maxspeed:backward",
      "maxspeed:forward",
      "maxspeed:conditional", -- show if present; details TBD
      "maxspeed:type",        -- only for debugging in webapp
      "zone:maxspeed",        -- only for debugging in webapp
      "source:maxspeed",      -- only for debugging in webapp
      "zone_traffic",
      "traffic_sign",
      "maxspeed_split",
      "checkdate:maxspeed",
    }
  )
  FilterTags(tags, allowed_tags)

  -- Freshness of data (AFTER `FilterTags`!)
  IsFresh(object, "checkdate:maxspeed", tags)

  tags._maxspeed_source = source
  if maxspeed ~= nil and maxspeed ~= -1 then
    table:insert(
      {
        tags = tags,
        geom = object:as_linestring(),
        meta = meta
      }
    )
    return
  end

  missingTable:insert(
    {
      tags = object.tags,
      geom = object:as_linestring(),
      meta = meta
    }
  )
end
