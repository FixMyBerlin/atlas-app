package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("RoadWidth")
require("ExcludeHighways")
require("CheckDataWithinYears")
require("StartsWith")
require("IsFresh")
require("categories")
require("transformations")
require("PrintTable")

local categoryTable = osm2pgsql.define_table({
  name = '_bikelanes_temp',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'category', type = 'text' },
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = '_offset', type = 'real' }
  }
})

local presenceTable = osm2pgsql.define_table({
  name = 'bikelanes_presence',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
    { column = 'left', type = 'text' },
    { column = 'self', type = 'text' },
    { column = 'right', type = 'text' },
  }
})

local excludeTable = osm2pgsql.define_table({
  name = 'bikelanes_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom', type = 'linestring' },
  }
})

-- whitelist of tags we want to insert intro the DB
local allowed_tags = Set({
  "_projected_from",
  "_projected_to",
  "access",
  "bicycle_road",
  "bicycle",
  "conditional",
  "cycleway",
  "foot",
  "footway",
  "highway",
  "is_sidepath",
  "mtb:scale",
  "name",
  "oneway", -- we use oneway:bicycle=no (which is transformed to oneway=no) to add a notice in the UI about two way cycleways in one geometry
  "segregated",
  "smoothness",
  "surface",
  "traffic_sign",
  "width", -- experimental
})

local function intoExcludeTable(object, reason)
  excludeTable:insert({
    tags = object.tags,
    meta = Metadata(object),
    reason = reason,
    geom = object:as_linestring()
  })
end

function osm2pgsql.process_way(object)
  -- filter highway classes
  if not object.tags.highway or not HighwayClasses[object.tags.highway] then return end

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    intoExcludeTable(object, reason)
    return
  end

  local tags = object.tags

  -- transformations
  local footwayTransformation = {
    highway = "footway",
    prefix = "sidewalk",
    filter = function(tags)
      return not (tags.footway == 'no' or tags.footway == 'separate')
    end
  }
  -- cycleway transformer:
  local cyclewayTransformation = {
    highway = "cycleway",
    prefix = "cycleway",
  }
  local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence

  -- generate cycleways from center line tagging
  local cycleways = GetTransformedObjects(tags, transformations);
  -- add the original object with `sign=0`
  tags.sign = 0
  table.insert(cycleways, tags)

  -- map presence vis signs
  local presence = { [1] = nil, [0] = nil, [-1] = nil }
  local width = RoadWidth(tags)
  for _, cycleway in pairs(cycleways) do
    local category = CategorizeBikelane(cycleway)
    if category ~= nil then
      local sign = cycleway.sign
      FilterTags(cycleway, allowed_tags)
      local freshTag = "check_date"
      if cycleway._projected_to then
        freshTag = "check_date:" .. cycleway._projected_to
      end
      IsFresh(object, freshTag, cycleway)
      categoryTable:insert({
        category = category,
        tags = cycleway,
        meta = Metadata(object),
        geom = object:as_linestring(),
        _offset = sign * width / 2
      })
      presence[sign] = presence[sign] or category
    end
  end
  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed
  if not (presence[-1] or presence[0] or presence[1]) then
    if Set({ "path",
      "cycleway",
      "track",
      "residential",
      "unclassified",
      "service",
      "living_street",
      "pedestrian",
      "service",
      "motorway_link",
      "motorway",
      "footway",
      "steps" })[tags.highway] then
      intoExcludeTable(object, "no infrastructure expected for highway type: " .. tags.highway)
      return
    elseif tags.motorroad or tags.expressway or tags.cyclestreet or tags.bicycle_road then
      intoExcludeTable(object, "no (extra) infrastructure expected for motorroad, express way and cycle streets")
      return
      -- elseif tags.maxspeed and tags.maxspeed <= 20 then
      --   intoExcludeTable(object, "no infrastructure expected for max speed <= 20 kmh")
      --   return
    end
  end

  -- TODO excludeTable: For ZES, we exclude "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts

  presenceTable:insert({
    tags = tags,
    geom = object:as_linestring(),
    left = presence[1] or "no",
    self = presence[0] or "no",
    right = presence[-1] or "no"
  })
end
