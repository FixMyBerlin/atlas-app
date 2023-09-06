package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("IsFresh")
require("categories")
require("transformations")
require("IntoExcludeTable")
require("CopyTags")
require("RoadWidth")

local bikelanesTable = osm2pgsql.define_table({
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
  'lane', -- 'cycleway:SIDE:lane'
})

function Bikelanes(object)
  -- filter highway classes
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

        -- Freshness of data (AFTER `FilterTags`!)
        IsFresh(object, freshTag, cycleway)

        -- Our atlas-app inspector should be explicit about tagging that OSM considers default/implicit
        if cycleway.oneway == nil then
          if tags.bicycle_road == 'yes' then
            tags.oneway = 'implicit_no'
          else
            tags.oneway = 'implict_yes'
          end
        end

        cycleway.offset = sign * width / 2

        bikelanesTable:insert({
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

  -- Below is presence logic
  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed (maybe wait for maxspeed PR)
  if (MinorRoadClasses[tags.highway] and tags.highway ~= 'service') or presence[CENTER_SIGN] then
    -- set the nil values to 'not_expected', for all minor roads and complete data
    for _, side in pairs(SIDES) do presence[side] = presence[side] or NOT_EXPECTED end
  elseif not (presence[CENTER_SIGN] or presence[RIGHT_SIGN] or presence[LEFT_SIGN]) then
    if not MajorRoadClasses[tags.highway] then
      IntoExcludeTable(excludeTable, object, "no infrastructure expected for highway type: " .. tags.highway)
      return {}
    elseif tags.motorroad or tags.expressway then
      IntoExcludeTable(excludeTable, object, "no infrastructure expected for motorroad and express way")
      return {}
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

  local presence_tags_cc = {
    'name',
    'highway',
    'oneway',
    'dual_carriageway',
  }

  local presence_data = {
    bikelane_left = presence[LEFT_SIGN],
    bikelane_self = presence[CENTER_SIGN],
    bikelane_right = presence[RIGHT_SIGN]
  }
  CopyTags(tags, presence_data, presence_tags_cc, "osm_")

  return presence_data
end
