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
require("JoinSets")
require("PrintTable")
require("IntoExcludeTable")

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
  name = 'bikelanesPresence',
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
  "side",
  "prefix",
  "access",
  "bicycle_road",
  "bicycle",
  "conditional",
  "cycleway",
  "foot",
  "footway",
  "highway",
  "is_sidepath",
  "name",
  "oneway", -- we use oneway:bicycle=no (which is transformed to oneway=no) to add a notice in the UI about two way cycleways in one geometry
  "segregated",
  "smoothness",
  "surface",
  "surface:color",
  "traffic_sign",
  "width", -- experimental
  "_parent_highway", -- debug
})


function osm2pgsql.process_way(object)
  -- filter highway classes
  local allowed_highways = JoinSets({HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses})
  if not object.tags.highway or not allowed_highways[object.tags.highway] then return end

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
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

  -- generate cycleways from center line tagging, also includes the original object with `sign = 0`
  local cycleways = GetTransformedObjects(tags, transformations);
  -- map presence via signs, could also initialize with {}
  local presence = { [LEFT_SIGN] = nil, [CENTER_SIGN] = nil, [RIGHT_SIGN] = nil }
  local width = RoadWidth(tags)
  for _, cycleway in pairs(cycleways) do
    local sign = cycleway.sign
    local onlyPresent = OnlyPresent(cycleway)
    if onlyPresent ~= nil then
      presence[sign] = presence[sign] or onlyPresent
    else
      local category= CategorizeBikelane(cycleway)
      if category ~= nil then
        FilterTags(cycleway, allowed_tags)
        local freshTag = "check_date"
        if cycleway.prefix then
          freshTag = "check_date:" .. cycleway.prefix
        end
        IsFresh(object, freshTag, cycleway)
        cycleway.offset  = sign * width / 2
        categoryTable:insert({
          category = category,
          tags = cycleway,
          meta = Metadata(object),
          geom = object:as_linestring(),
          _offset = cycleway.offset
        })
        presence[sign] = presence[sign] or category
      end

    end
  end
  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed (maybe wait for maxspeed PR)
  if not (presence[LEFT_SIGN] or presence[CENTER_SIGN] or presence[RIGHT_SIGN]) then
    if JoinSets({ HighwayClasses, MinorRoadClasses, PathClasses })[tags.highway] then
      IntoExcludeTable(excludeTable, object, "no infrastructure expected for highway type: " .. tags.highway)
      return
    elseif tags.motorroad or tags.expressway or tags.cyclestreet or tags.bicycle_road then
      IntoExcludeTable(excludeTable, object, "no (extra) infrastructure expected for motorroad, express way and cycle streets")
      return
      -- elseif tags.maxspeed and tags.maxspeed <= 20 then
      --   intoExcludeTable(object, "no infrastructure expected for max speed <= 20 kmh")
      --   return
    end
  end

  -- TODO excludeTable: For ZES, we exclude "Verbindungsstücke", especially for the "cyclewayAlone" case
  -- We would have to do this in a separate processing step or wait for length() data to be available in LUA
  -- MORE: osm-scripts-Repo => utils/Highways-BicycleWayData/filter/radwegVerbindungsstueck.ts

  if presence[CENTER_SIGN] then
    -- TODO: here we could check for collissions between center line and self
    presence[LEFT_SIGN] = presence[LEFT_SIGN] or 'not_expected'
    presence[RIGHT_SIGN] = presence[RIGHT_SIGN] or 'not_expected'
  end

  presenceTable:insert({
    tags = tags,
    geom = object:as_linestring(),
    left = presence[LEFT_SIGN] or "missing",
    self = presence[CENTER_SIGN] or "missing",
    right = presence[RIGHT_SIGN] or "missing"
  })
end
