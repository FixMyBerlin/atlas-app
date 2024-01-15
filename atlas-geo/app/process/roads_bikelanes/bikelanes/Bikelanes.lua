package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/?.lua"
require("Set")
require("FilterTags")
require("Metadata")
require("HighwayClasses")
require("TimeUtils")
require("categories")
require("transformations")
require("IntoExcludeTable")
require("CopyTags")
require("RoadWidth")
require("ToMarkdownList")
require("DeriveSurface")
require("DeriveSmoothness")
require("BikelanesTodos")

local bikelanesTable = osm2pgsql.define_table({
  name = '_bikelanes_temp',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
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

-- these tags are copied (Eigennamen)
local allowed_tags = {
  "name",
}
-- these tags are copied and prefixed with `osm_`
local tags_cc = {
  'cycleway',
  'cycleway:lane', -- 'advisory', 'exclusive'
  'lane',          -- 'cycleway:SIDE:lane'
  'dual_carriageway',
  'highway',
  'oneway', -- we use oneway:bicycle=no (which is transformed to oneway=no) to add a notice in the UI about two way cycleways in one geometry
  'surface:colour',
  'traffic_sign',
  'traffic_sign:forward',
  'traffic_sign:backward',
  'separation',
  'separation:left',
  'separation:right',
  'traffic_mode',
  'traffic_mode:left',
  'traffic_mode:right',
  "mapillary",
  "description",
}

local sides = { LEFT_SIGN, CENTER_SIGN, RIGHT_SIGN }
function Bikelanes(object, road)
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
        -- === Processing on the whole dataset ===
        -- cycleway._todos = ToMarkdownList(BikelanesTodos(cycleway))
        local smoothness_data = DeriveSmoothness(cycleway)
        local surface_data = DeriveSurface(cycleway)

        -- Our atlas-app inspector should be explicit about tagging that OSM considers default/implicit
        local oneway = nil
        if cycleway.oneway == nil then
          if tags.bicycle_road == 'yes' then
            oneway = 'implicit_no'
          else
            oneway = 'implicit_yes'
          end
        end

        -- === Processing on the transformed dataset ===
        local freshTag = "check_date"
        if sign == CENTER_SIGN then
          -- if we're dealing with the original object (center line) then only keep all the tags from the `tags_cc` list and prefix them
          -- due to that it's important that the precceding operations happen before
          --
          -- Restart with a clean `cycleway` object because `cycleway=tags` (un-sanitized) for the centerline case.
          -- For non-centerline objects the data is already sanitized.
          cycleway = {}

          local categorySharedInfrastructure = Set({
            'sharedBusLane',
            'explicitSharedLaneButNoSignage',
            'sharedMotorVehicleLane',
            'cyclewayOnHighwayBetweenLanes',
            'cyclewayOnHighway_advisory',
            'cyclewayOnHighway_exclusive',
            'cyclewayOnHighway_advisoryOrExclusive',
          })
          if not categorySharedInfrastructure[category] then
            cycleway.width = tags.width
          end
        else
          freshTag = "check_date:" .. cycleway.prefix
        end

        if tags[freshTag] then
          cycleway.age = AgeInDays(ParseDate(tags[freshTag]))
        end

        -- Sanitize tags
        cycleway = CopyTags(cycleway, tags, tags_cc, 'osm_')
        cycleway.width = ParseLength(cycleway.width)
        cycleway.category = category
        cycleway.offset = sign * width / 2
        cycleway.road = road
        cycleway.oneway = oneway
        MergeTable(cycleway, surface_data)
        MergeTable(cycleway, smoothness_data)
        -- Unsanitized tags
        cycleway = CopyTags(cycleway, tags, allowed_tags)

        bikelanesTable:insert({
          tags = cycleway,
          meta = Metadata(object),
          geom = object:as_linestring(),
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
    for _, side in pairs(sides) do presence[side] = presence[side] or NOT_EXPECTED end
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
  for _, side in pairs(sides) do presence[side] = presence[side] or "missing" end

  local presence_tags_cc = {
    'name',
    'highway',
    'oneway',
    'dual_carriageway',
    -- https://wiki.openstreetmap.org/wiki/Proposal:Separation
    'separation:left',
    'separation:right',
  }

  local presence_data = {}
  -- Only apply presence-tags on roads need them, not "highway=cycleway|path|footway|track"
  if not PathClasses[tags.highway] then
    presence_data = {
      bikelane_left = presence[LEFT_SIGN],
      bikelane_self = presence[CENTER_SIGN],
      bikelane_right = presence[RIGHT_SIGN]
    }
  end

  CopyTags(presence_data, tags, presence_tags_cc, "osm_")

  return presence_data
end
