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

package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("FilterTags")
require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("AddMetadata")
require("AddUrl")
require("HighwayClasses")
require("AddSkipInfoToHighways")
require("StartsWith")

-- Define tables with all bicycle related roads what contain speed values
local table =
osm2pgsql.define_table(
  {
    name = "maxspeed",
    ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
    columns = {
      { column = "tags", type = "jsonb" },
      { column = "geom", type = "linestring" }
    }
  }
)

-- Define tables with all non bicycle related roads
local skipTable =
osm2pgsql.define_table(
  {
    name = "maxspeed_skipList",
    ids = { type = "any", id_column = "osm_id", type_column = "osm_type" },
    columns = {
      { column = "tags", type = "jsonb" },
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
      { column = "geom", type = "linestring" }
    }
  }
)

function osm2pgsql.process_way(object)
  local allowed_values = HighwayClasses
  if not allowed_values[object.tags.highway] then
    return
  end
  object.tags._skipNotes = "Skipped by default `true`"
  object.tags._skip = true
  object.tags._todo = false

  -- Skip all waytypes, that are unuseful, because they are not bicycle related
  if object.tags.highway == "motorway" or object.tags.highway == "motorway_link" or object.tags.highway == "trunk" or
      object.tags.highway == "bridleway"
  then
    object.tags._skip = true
    object.tags._skipNotes = "Skipped by unuseful waytypes"
  end
  AddSkipInfoToHighways(object)

  -- All standard ways, which should be observed in any case
  if object.tags.highway == "residential" or object.tags.highway == "secondary" or
      object.tags.highway == "unclassified" or
      object.tags.highway == "bicycle_road"
  then
    object.tags._skip = false
  end

  -- All special day combinations which are wheel-related. This section is based on the code from bicycleroadinfrasturcture.lua
  if object.tags.highway == "steps" then
    object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=steps`"
    object.tags._skip = true
  end

  if object.tags.highway == "pedestrian" then
    if object.tags.bicycle == "yes" then
      object.tags._skip = false
    else
      object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=pedestrian + bicycle!=yes`"
      object.tags._skip = true
    end
  end

  if object.tags.highway == "living_street" and not object.tags.bicycle == "no" then
    object.tags.category = "livingStreet"
    object.tags._skip = false
  end

  if object.tags.bicycle_road == "yes" or StartsWith(object.tags.traffic_sign, "DE:244") then
    object.tags._skip = false
  end

  if (object.tags.bicycle == "designated" and object.tags.foot == "designated" and object.tags.segregated == "no") or
      StartsWith(object.tags.traffic_sign, "DE:240")
  then
    object.tags.category = "footAndCycleway_shared"
    object.tags._skip = false
  end

  if (object.tags.bicycle == "designated" and object.tags.foot == "designated" and object.tags.segregated == "yes") or
      StartsWith(object.tags.traffic_sign, "DE:241")
  then
    object.tags.category = "footAndCycleway_segregated"
    object.tags._skip = false
  end

  if object.tags.highway == "footway" or object.tags.highway == "path" then
    if object.tags["mtb:scale"] then
      object.tags._skipNotes = object.tags._skipNotes .. ";Skipped `highway=footway|path` but `mtb:scale`"
      object.tags._skip = true
    end

    if object.tags.bicycle == "yes" or StartsWith(object.tags.traffic_sign, "DE:239,1022-10") then
      object.tags.category = "footway_bicycleYes"
      object.tags._skip = false
    end
  end

  -- Sort the paths depending on whether they have a maxspeed tag in the ToDo table or in the results table
  if object.tags.maxspeed then
    if object.tags._skip == true then
      -- maxspeed available but path type not correct -> _skip table
      object.tags._todo = false
    else
      -- maxspeed available and path type is correct -> result table
      object.tags._todo = false
      object.tags._skip = false
    end
  else
    if object.tags._skip == true then
      -- maxspeed not available and path type is not correct -> _skip table
      object.tags._todo = false
      object.tags._skip = true
    else
      -- maxspeed not available and path type is correct -> _todo table
      object.tags._todo = true
      object.tags._skip = false
    end
  end

  -- wenn maxspeed
  --  - maxspeed = <zahl>
  --  - _maxspeed_source = "maxspeed-tag"
  -- wenn kein maxspeed
  -- aber eines der source-tags, dann…
  --  - maxspeed = <zahl> inferred from source tag
  --  - _maxspec_source = "source tag"
  --  (szenarien de:urbuan, de:rural, bike_roads,  verschiedene zonen)
  --  siehe auch https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/Highways-MaxspeedData/utils/addMaxspeedProperty.ts
  --  verkehrsberuhigere bereich als string (nicht als Zahl)
  -- debugging-todos:
  --  - wenn maxpseed-zahl nicht passt zu source-tags (alle varianten), dann fehler _todo="source <TAG=VALUE>"

  -- forwad-backwrad behandeln
  -- - maxspeed_forward=<zahl> (default null)
  -- - maxspeed_forward_source=<wert>
  -- - maxspeed_backward=<zahl> (default null)
  -- - maxspeed_backward_source=<wert>

  -- "maxspeed:conditional" — reichen wir durch; mehrwert ist noch fraglich; viele sonderfälle

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

  -- "Freshness of data" in Datei lit.lua
  -- Gern abstrahieren in helper.

  -- all tags that are shown on the application
  local allowed_tags =
  Set(
    {
      "_centerline",
      "_skip",
      "_skipNotes",
      "_todo",
      "bicycle_road",
      "bicycle",
      "category",
      "cycleway",
      "unclassified",
      "secondary",
      "residential",
      "highway",
      "maxspeed",
      "maxspeed:conditional", -- show if present; details TBD
      "source:maxspeed", -- only for debugging in webapp
      "maxspeed:type", -- only for debugging in webapp
      "zone:maxspeed", -- only for debugging in webapp
      "zone_traffic",
      "traffic_sign" -- only for debugging in webapp
    }
  )

  FilterTags(object.tags, allowed_tags)
  AddMetadata(object)
  AddUrl("way", object)

  -- insert the ways in theri respective table based on the tags _skip or _todo
  if object.tags._skip == true then
    skipTable:insert(
      {
        tags = object.tags,
        geom = object:as_linestring()
      }
    )
  end

  if object.tags._todo == true and object.tags._skip == false then
    todoTable:insert(
      {
        tags = object.tags,
        geom = object:as_linestring()
      }
    )
  end

  if object.tags._skip == false and object.tags._todo == false then
    object.tags._skip = nil
    object.tags._skipNotes = nil
    object.tags._todo = nil
    table:insert(
      {
        tags = object.tags,
        geom = object:as_linestring()
      }
    )
  end
end
