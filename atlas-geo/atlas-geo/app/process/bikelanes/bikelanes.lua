package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua;/app/process/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("RoadWidth")
require("ExcludeHighways")
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
    { column = 'tags',     type = 'jsonb' },
    { column = 'meta',     type = 'jsonb' },
    { column = 'geom',     type = 'linestring' },
    { column = '_offset',  type = 'real' }
  }
})

local presenceTable = osm2pgsql.define_table({
  name = 'bikelanesPresence',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',  type = 'jsonb' },
    { column = 'geom',  type = 'linestring' },
    { column = 'left',  type = 'text' },
    { column = 'self',  type = 'text' },
    { column = 'right', type = 'text' },
    { column = 'meta',  type = 'jsonb' }
  }
})

local excludeTable = osm2pgsql.define_table({
  name = 'bikelanes_excluded',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags',   type = 'jsonb' },
    { column = 'meta',   type = 'jsonb' },
    { column = 'reason', type = 'text' },
    { column = 'geom',   type = 'linestring' },
  }
})

-- whitelist of tags we want to insert intro the DB
local allowed_tags = Set({
  '_parent_highway',
  'access',
  'bicycle_road',
  'bicycle',
  'conditional',
  'cycleway',
  'cycleway:lane', -- 'advisory', 'exclusive'
  'dual_carriageway',
  'foot',
  'footway',
  'highway',
  'is_sidepath',
  'name',
  'oneway', -- we use oneway:bicycle=no (which is transformed to oneway=no) to add a notice in the UI about two way cycleways in one geometry
  'prefix',
  'segregated',
  'side',
  'smoothness',
  'surface:colour',
  'surface',
  'traffic_sign',
  'width',
  'bicycle:lanes',
  'cycleway:lanes',
  'separation',
  'separation:left',
  'separation:right',
})

function osm2pgsql.process_way(object)
  -- filter highway classes
  local allowed_highways = JoinSets({ HighwayClasses, MajorRoadClasses, MinorRoadClasses, PathClasses })
  if not object.tags.highway or not allowed_highways[object.tags.highway] then return end

  local exclude, reason = ExcludeHighways(object.tags)
  if exclude then
    IntoExcludeTable(excludeTable, object, reason)
    return
  end

  local tags = object.tags
  local meta = Metadata(object)

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
  local presence = {} -- table holding the presence (per way object)
  local width = RoadWidth(tags)
  for _, cycleway in pairs(cycleways) do
    local sign = cycleway.sign
    local onlyPresent = OnlyPresent(cycleway) -- these are categories defining the presence of data
    if onlyPresent ~= nil then
      presence[sign] = presence[sign] or onlyPresent
    else
      local category = CategorizeBikelane(cycleway)
      if category ~= nil then
        FilterTags(cycleway, allowed_tags)
        local freshTag = "check_date"
        if cycleway.prefix then
          freshTag = "check_date:" .. cycleway.prefix
        end

        -- Freshness of data (ATER `FilterTags`!)
        IsFresh(object, freshTag, cycleway)

        cycleway.offset = sign * width / 2
        categoryTable:insert({
          category = category,
          tags = cycleway,
          meta = meta,
          geom = object:as_linestring(),
          _offset = cycleway.offset
        })
        presence[sign] = presence[sign] or category
      end
    end
  end

  -- Below is presence logic
  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed (maybe wait for maxspeed PR)
  if (MinorRoadClasses[tags.highway] and tags.highway ~= 'service') or presence[CENTER_SIGN] then
    -- set the nil values to 'not_expected', for all minor roads and complete data
    for _, side in pairs(SIDES) do presence[side] = presence[side] or NOT_EXPECTED end
  elseif not (presence[CENTER_SIGN] or presence[RIGHT_SIGN] or presence[LEFT_SIGN]) then
    if not MajorRoadClasses[tags.highway] then
      IntoExcludeTable(excludeTable, object, "no infrastructure expected for highway type: " .. tags.highway)
      return
    elseif tags.motorroad or tags.expressway then
      IntoExcludeTable(excludeTable, object, "no infrastructure expected for motorroad and express way")
      return
      -- elseif tags.maxspeed and tags.maxspeed <= 20 then
      --   intoExcludeTable(object, "no infrastructure expected for max speed <= 20 kmh")
      --   return
    end
  elseif (presence[RIGHT_SIGN] or presence[LEFT_SIGN]) then
    presence[CENTER_SIGN] = presence[CENTER_SIGN] or NOT_EXPECTED
  end
  if tags.oneway == 'yes' and tags['oneway:bicycle'] ~= 'no' then
    presence[LEFT_SIGN] = presence[LEFT_SIGN] or NOT_EXPECTED
  end

  -- replace all nil values with 'missing'
  for _, side in pairs(SIDES) do presence[side] = presence[side] or "missing" end

  local allowed_tags_presence = Set({
    'left',
    'right',
    'self',
    'name',
    'highway',
    'oneway',
    'dual_carriageway',
  })
  FilterTags(tags, allowed_tags_presence)
  presenceTable:insert({
    tags = tags,
    geom = object:as_linestring(),
    left = presence[LEFT_SIGN],
    self = presence[CENTER_SIGN],
    right = presence[RIGHT_SIGN],
    meta = meta,
  })
end
