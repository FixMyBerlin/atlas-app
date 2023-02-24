-- Goal:
-- =====
-- A map that shows `maxspeed` data.

-- Notes:
-- =====
-- This topic need some discovery, first.
--
-- In general, maxspeed data is not tagged well in OSM.
-- One reasons is, that the data is not visible at all, so no one sees missing data or tagging mistages.
--
-- Approach 1: Just take "maxspeed"
-- Just take the explicitly tagged data. Rely on the community to fill in the blanks.
-- That would work in time; however, OSM does not like tagging implict data. So tagging the whole city with "maxspeed=50" is bad practise.
--
-- Approach 2: Add source-Data to the mix.
-- Whenever the maxspeed is implicit, one could make this fact explicit by addin a source info.
-- Unfortunatelly there are multipe tagging schemas in use, which makes this complex…
-- However, we can use this data to derive maxspeed data for all roads with source-tagging.
-- Which is what I did for our proof of concept.
--    See https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/Highways-MaxspeedData/utils/addMaxspeedProperty.ts
-- I also add my own source-Tag to tell our user where the maxspeed value comes from.
--    See https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/Highways-MaxspeedData/utils/addMaxspeedSourceProperty.ts
--
-- Approach 3: Library
-- After our proof of concept was done, Tobias Zwick released a new library, that does parts of what we did, but with a lot more detail.
--    See https://github.com/westnordost/osm-legal-default-speeds
--    Demo https://westnordost.github.io/osm-legal-default-speeds/#tags=highway%3Dprimary&cc=DE
-- We could use this library to fill in the blanks.
-- However, it is unclear how we would run the library code as part of our technical setup.
--    Update: Something I asked at https://github.com/openstreetmap/osm2pgsql/discussions/1765
-- And the library does not solve the "source" information (yet), so that would be something we need to build ourself.
-- Also, the `*zone*` source schema is not supported (see https://github.com/westnordost/osm-legal-default-speeds/issues/4)
--    Update: Tobias Zwick pointed out, that this is _not_an_issue.
-- Also, the main benefit of the library are very detailed maxsped values for bus and such… which we don't need.

-- TodoList
-- =====
-- In addition to the data layer, we will likely need a TodoList Data Layer that guides users to fill in the blanks in spots where … for example …
--    * no maxspeed _and_ no source is given
--    * multiple source taggings are used that are in conflict


-- Review TodoList
-- =====
-- - [ ] AFAIK the whole bike categorization in this file can be removed. It is likely left over from the copied file(?)
-- - [ ] Can we apply the new "real excludeTable" pattern that does not just mark as excluded but actually exits for this file? Is it worth it?
-- - [ ] Rebase on to of main
-- - [ ] Use our new freshness and presence logic (naming of fields, helper methods)
-- - [ ] Stichproben of the resulted response
-- - [ ] Merge into main so we can run the data on production an use it in a hidden part of the app

package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
require("MergeArray")
require("Metadata")
require("HighwayClasses")
require("StartsWith")
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
                { column = "tags", type = "jsonb" },
                { column = "meta", type = "jsonb" },
                { column = 'maxspeed', type = 'integer'},
                { column = "geom", type = "linestring" }
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
                { column = "tags", type = "jsonb" },
                { column = "meta", type = "jsonb" },
                { column = 'reason', type = 'text' },
                { column = "geom", type = "linestring" }
            }
        }
    )

-- Define tables with all bicycle related roads that currently dont have speed values
local todoTable =
    osm2pgsql.define_table(
        {
            name = "maxspeed_todoList",
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
  local speed_tags = {"maxspeed:forward", "maxspeed:backward", "maxspeed"}
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

  if maxspeed_type[tags["maxspeed_type"]] then
    return maxspeed_type[tags["maxspeed_type"]], "maxspeed_type"
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
  local allowed_values = JoinSets({MajorRoadClasses, MinorRoadClasses})
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
  local maxspeed, source =  maxspeedDirect(tags)
  if maxspeed < 0 then
    maxspeed, source = maxspeedFromZone(tags)
  end

  -- TODO: fallback option on highway type
  if maxspeed == nil or maxspeed == -1  then
    local highway_speeds = {
      ["living_street"] = 15
    }
    maxspeed = highway_speeds[tags.highway]
  end
  -- SQL:
  -- für alle linien die kein maxpseed haben (auch nicht über die source-tags)
  --  wir nehmen die landuse=residential+industrial+commerical+retail
  --  buffer von ~10m um die fläche
  --  dann alle linien die (TODO) vollständig / am meisten / … in der fläche fläche sind
  --  (tendentizell dafür nicht schneiden, weil wir am liebsten die OSM ways so haben wie in OSM)
  --  und dann können wir in sql "maxspeed" "maxspeed_source='infereed from landuse'"
  --  UND dann auch einen "_todo="add 'maxspeed:source=DE:urban' to way"
  -- hinweis: außerstädtisch extrapolieren wir aber keine daten, da zu wenig "richtig"


  -- "is_present": Skip-Values umbauen, so dass alle maxspeed-relevanten daten im haupt datensatz sind
  --    wenn primärdaten vorhanden, dann is_present=true

  -- all tags that are shown on the application
  local allowed_tags =
      Set(
          {
              "_todo",
              "bicycle_road",
              "bicycle",
              "cycleway",
              "highway",
              "maxspeed",
              "maxspeed:backward",
              "maxspeed:forward",
              "maxspeed:conditional", -- show if present; details TBD
              "source:maxspeed", -- only for debugging in webapp
              "maxspeed:type", -- only for debugging in webapp
              "zone:maxspeed", -- only for debugging in webapp
              "zone_traffic",
              "traffic_sign",
              "maxspeed_split",
              "source_maxspeed_forward",
              "source_maxspeed_backward",
              "source_maxspeed" -- only for debugging in webapp
          }
      )

  FilterTags(tags, allowed_tags)
  -- Freshness of data
  IsFresh(object, "checkdate:maxspeed", tags)
  tags._maxspeed_source = source
if maxspeed ~= nil and maxspeed ~= -1 then
    tags.present = true
    table:insert(
        {
            tags = tags,
            geom = object:as_linestring(),
            maxspeed = maxspeed,
            meta = meta
        }
    )
    return
  end

  todoTable:insert(
      {
          tags = object.tags,
          geom = object:as_linestring(),
          meta = meta
      }
  )
end
