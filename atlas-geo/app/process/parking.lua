package.path = package.path .. ";/app/process/helper/?.lua"
require("HasAreaTags")

local json = require('dkjson')
local srid = 4326
local tables = {}

--TODO don't use boolean for oneway
tables.highways = osm2pgsql.define_way_table('highways', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'type', type = 'text' },
  { column = 'geom', type = 'linestring', projection = srid },
  { column = 'surface', type = 'text' },
  { column = 'name', type = 'text' },
  { column = 'oneway', type = 'bool' },
  { column = 'service', type = 'text' },
  { column = 'dual_carriageway', type = 'bool' },
  { column = 'lanes', sql_type = 'numeric' },
  { column = 'width', sql_type = 'numeric' },
  { column = 'parking', type = 'text' },
  { column = 'parking_lane_left', type = 'text' },
  { column = 'parking_lane_right', type = 'text' },
  { column = 'parking_lane_width_proc', sql_type = 'numeric' },
  { column = 'parking_lane_width_effective', sql_type = 'numeric' },
  { column = 'parking_lane_left_position', type = 'text' },
  { column = 'parking_lane_right_position', type = 'text' },
  { column = 'parking_lane_left_width', sql_type = 'numeric' },
  { column = 'parking_lane_right_width', sql_type = 'numeric' },
  { column = 'parking_lane_left_width_carriageway', sql_type = 'numeric' },
  { column = 'parking_lane_right_width_carriageway', sql_type = 'numeric' },
  { column = 'parking_lane_left_offset', sql_type = 'numeric' },
  { column = 'parking_lane_right_offset', sql_type = 'numeric' },
  { column = 'parking_condition_left', type = 'text' },
  { column = 'parking_condition_left_other', type = 'text' },
  { column = 'parking_condition_right', type = 'text' },
  { column = 'parking_condition_right_other', type = 'text' },
  { column = 'parking_condition_left_other_time', type = 'text' },
  { column = 'parking_condition_right_other_time', type = 'text' },
  { column = 'parking_condition_left_default', type = 'text' },
  { column = 'parking_condition_right_default', type = 'text' },
  { column = 'parking_condition_left_time_interval', type = 'text' },
  { column = 'parking_condition_right_time_interval', type = 'text' },
  { column = 'parking_condition_left_maxstay', type = 'text' },
  { column = 'parking_condition_right_maxstay', type = 'text' },
  { column = 'parking_lane_left_capacity', sql_type = 'numeric' },
  { column = 'parking_lane_right_capacity', sql_type = 'numeric' },
  { column = 'parking_lane_left_source_capacity', type = 'text' },
  { column = 'parking_lane_right_source_capacity', type = 'text' },
  { column = 'error_output', type = 'jsonb' },
})

tables.service = osm2pgsql.define_way_table('service', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'type', type = 'text' },
  { column = 'geom', type = 'linestring', projection = srid },
  { column = 'surface', type = 'text' },
  { column = 'name', type = 'text' },
  { column = 'oneway', type = 'bool' },
  { column = 'service', type = 'text' },
  { column = 'dual_carriageway', type = 'bool' },
  { column = 'lanes', sql_type = 'numeric' },
  { column = 'width', sql_type = 'numeric' },
  { column = 'parking', type = 'text' },
  { column = 'parking_lane_left', type = 'text' },
  { column = 'parking_lane_right', type = 'text' },
  { column = 'parking_lane_width_proc', sql_type = 'numeric' },
  { column = 'parking_lane_width_effective', sql_type = 'numeric' },
  { column = 'parking_lane_left_position', type = 'text' },
  { column = 'parking_lane_right_position', type = 'text' },
  { column = 'parking_lane_left_width', sql_type = 'numeric' },
  { column = 'parking_lane_right_width', sql_type = 'numeric' },
  { column = 'parking_lane_left_width_carriageway', sql_type = 'numeric' },
  { column = 'parking_lane_right_width_carriageway', sql_type = 'numeric' },
  { column = 'parking_lane_left_offset', sql_type = 'numeric' },
  { column = 'parking_lane_right_offset', sql_type = 'numeric' },
  { column = 'parking_condition_left', type = 'text' },
  { column = 'parking_condition_left_other', type = 'text' },
  { column = 'parking_condition_right', type = 'text' },
  { column = 'parking_condition_right_other', type = 'text' },
  { column = 'parking_condition_left_other_time', type = 'text' },
  { column = 'parking_condition_right_other_time', type = 'text' },
  { column = 'parking_condition_left_default', type = 'text' },
  { column = 'parking_condition_right_default', type = 'text' },
  { column = 'parking_condition_left_time_interval', type = 'text' },
  { column = 'parking_condition_right_time_interval', type = 'text' },
  { column = 'parking_condition_left_maxstay', type = 'text' },
  { column = 'parking_condition_right_maxstay', type = 'text' },
  { column = 'parking_lane_left_capacity', sql_type = 'numeric' },
  { column = 'parking_lane_right_capacity', sql_type = 'numeric' },
  { column = 'parking_lane_left_source_capacity', type = 'text' },
  { column = 'parking_lane_right_source_capacity', type = 'text' },
  { column = 'error_output', type = 'jsonb' },
})

tables.footways = osm2pgsql.define_way_table('footways', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'footway', type = 'text' },
  { column = 'geom', type = 'linestring', projection = srid },
  { column = 'surface', type = 'text' },
  { column = 'is_sidepath:of', type = 'text' },
  { column = 'is_sidepath:of:name', type = 'text' },
  { column = 'error_output', type = 'jsonb' },
})

tables.parking_poly = osm2pgsql.define_area_table('parking_poly', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'geom', type = 'geometry', projection = srid },
  { column = 'amenity', type = 'text' },
  { column = 'access', type = 'text' },
  { column = 'capacity', sql_type = 'numeric' },
  { column = 'parking', type = 'text' },
  { column = 'building', type = 'text' },
  { column = 'parking_orientation', type = 'text' },
  { column = 'parking_street_side_of', type = 'text' },
  { column = 'parking_street_side_of_name', type = 'text' },
  { column = 'error_output', type = 'jsonb' },
})

tables.crossings = osm2pgsql.define_node_table('crossings', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'highway', type = 'text' },
  { column = 'crossing', type = 'text' },
  { column = 'crossing_ref', type = 'text' },
  { column = 'kerb', type = 'text' },
  { column = 'crossing_buffer_marking', type = 'text' },
  { column = 'crossing_kerb_extension', type = 'text' },
  { column = 'traffic_signals_direction', type = 'text' },
  { column = 'geom', type = 'point', projection = srid },
})

tables.pt_platform = osm2pgsql.define_way_table('pt_platform', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'geom', type = 'linestring', projection = srid },
  { column = 'name', type = 'text' },
  { column = 'bus', type = 'text' },
  { column = 'tram', type = 'text' },
  { column = 'railway', type = 'text' },
  { column = 'highway', type = 'text' },
  { column = 'error_output', type = 'jsonb' },
})

tables.pt_stops = osm2pgsql.define_node_table('pt_stops', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'name', type = 'text' },
  { column = 'public_transport', type = 'text' },
  { column = 'highway', type = 'text' },
  { column = 'bus', type = 'bool' },
  { column = 'tram', type = 'bool' },
  { column = 'railway', type = 'text' },
  { column = 'subway', type = 'bool' },
  { column = 'light_rail', type = 'bool' },
  { column = 'geom', type = 'point', projection = srid },
})

tables.ramps = osm2pgsql.define_node_table('ramps', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'operator', type = 'text' },
  { column = 'kerb', type = 'text' },
  { column = 'geom', type = 'point', projection = srid },
})

tables.amenity_parking_points = osm2pgsql.define_node_table('amenity_parking_points', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'amenity', type = 'text' },
  { column = 'access', type = 'text' },
  { column = 'capacity', sql_type = 'numeric' },
  { column = 'bicycle', type = 'text' },
  { column = 'small_electric_vehicle', sql_type = 'text' },
  { column = 'small_vehicle_parking_position', type = 'text' },
  { column = 'parking', type = 'text' },
  { column = 'parking_position', type = 'text' },
  { column = 'geom', type = 'point', projection = srid },
})

tables.traffic_calming_points = osm2pgsql.define_node_table('traffic_calming_points', {
  { column = 'id', sql_type = 'serial', create_only = true },
  { column = 'traffic_calming', type = 'text' },
  { column = 'priority', type = 'text' },
  { column = 'geom', type = 'point', projection = srid },
})

-- tables.hydrant = osm2pgsql.define_node_table('hydrant', {
--     { column = 'id', sql_type = 'serial', create_only = true },
--     { column = 'emergency', type = 'text' },
--     { column = 'ref', type = 'text' },
--     { column = 'fire_hydrant_type', type = 'text' },
--     { column = 'fire_hydrant_position', type = 'text' },
--     { column = 'fire_hydrant_diameter', type = 'text' },
--     { column = 'geom', type = 'point' , projection = srid},
-- })

local highway_list = {
  'primary',
  'primary_link',
  'secondary',
  'secondary_link',
  'tertiary',
  'tertiary_link',
  'residential',
  'living_street',
  'pedestrian',
  'road',
  'unclassified',
  'construction'
}

-- Prepare table 'highway_types' for quick checking of highway types
local highway_types = {}
for _, k in ipairs(highway_list) do
  highway_types[k] = 1
end

-- default width of streets (if not specified more precisely on the data object)
local width_minor_street = 11
local width_primary_street = 17
local width_secondary_street = 15
local width_tertiary_street = 13
local width_service = 4
local width_driveway = 2.5

-- default width of parking lanes (if not specified more precisely on the data object)
local width_para = 2 -- parallel parking -----
local width_diag = 4.5 -- diagonal parking /////
local width_perp = 5 -- perpendicular p. |||||

-- parking space length / distance per vehicle depending on parking direction
-- TODO: Attention: In some calculation steps that use field calculator formulas, these values are currently still hardcoded – if needed, the formulas would have to be generated as a string using these variables
local vehicle_dist_para = 5.2 -- parallel parking
local vehicle_dist_diag = 3.1 -- diagonal parking (angle: 60 gon = 54°)
local vehicle_dist_perp = 2.5 -- perpendicular parking
local vehicle_length = 4.4 -- average vehicle length (a single vehicle, without manoeuvring distance)
local vehicle_width = 1.8 -- average vehicle width

-- list of highway tags that do not belong to the regular road network but are also analysed
local service_list = { 'service', 'track', 'bus_guideway', 'footway', 'cycleway', 'path' }

-- Prepare table 'service_types' for quick checking of service types
local service_types = {}
for _, k in ipairs(service_list) do
  service_types[k] = 1
end

local crossing_list = {
  'zebra',
  'marked',
  'traffic_signals',
  'no',
  'unmarked'
}

-- Prepare table 'crossings' for quick checking of highway types
local crossing_types = {}
for _, k in ipairs(crossing_list) do
  crossing_types[k] = 1
end


local parking_orientation_keys = {
  'parking:lane:left:parallel',
  'parking:lane:left:perpendicular',
  'parking:lane:left:diagonal',
  'parking:lane:right:parallel',
  'parking:lane:right:perpendicular',
  'parking:lane:right:diagonal',
  'parking:lane:both:parallel',
  'parking:lane:both:perpendicular',
  'parking:lane:both:diagonal'
}

local rev_parking_orientation = {}
for _, k in ipairs(parking_orientation_keys) do
  rev_parking_orientation[k] = 1
end

local orientation_keys = {
  'parallel',
  'perpendicular',
  'diagonal'
}

local rev_orientation = {}
for _, k in ipairs(orientation_keys) do
  rev_orientation[k] = 1
end

local parking_keys = {
  'parallel',
  'perpendicular',
  'diagonal',
  'marked'
}

local rev_parking = {}
for _, k in ipairs(parking_keys) do
  rev_parking[k] = 1
end

local bicycle_parking_position_keys = {
  'driveway',
  'kerb_extension',
  'lane',
  'parking_lane',
  'service_way',
  'street_side',
  'traffic_island'
}

local rev_bicycle_parking_position = {}
for _, k in ipairs(bicycle_parking_position_keys) do
  rev_bicycle_parking_position[k] = 1
end

local position_keys = {
  'on_kerb',
  'shoulder',
  'lay_by',
  'street_side'
}

local rev_position = {}
for _, k in ipairs(position_keys) do
  rev_position[k] = 1
end

local crossing_exclude_values = {
  --'unmarked',
  'uncontrolled',
}

local rev_crossing_exclude_values = {}
for _, k in ipairs(crossing_exclude_values) do
  rev_crossing_exclude_values[k] = 1
end

-- local readable_attributes = {
--   'parking:lane:both',
--   'parking:lane:left',
--   'parking:lane:right',
--   'parking:lane:left:capacity',
--   'parking:lane:right:capacity',
--   'parking:lane:both:capacity',
--   'parking:lane:left:width',
--   'parking:lane:right:width',
--   'parking:lane:both:width',
--   'parking:lane:left:width:carriageway',
--   'parking:lane:right:width:carriageway',
--   'parking:lane:left:position',
--   'parking:lane:right:position',
--   'parking:lane:left:offset',
--   'parking:lane:right:offset',
--   'parking:condition:left',
--   'parking:condition:right',
--   'parking:condition:both',
--   'parking:condition:left:default',
--   'parking:condition:right:default',
--   'parking:condition:both:default',
--   'parking:condition:left:time_interval',
--   'parking:condition:right:time_interval',
--   'parking:condition:both:time_interval',
--   'parking:condition:left:maxstay',
--   'parking:condition:right:maxstay',
--   'parking:condition:both:maxstay',
--   "parking:lane:left:parallel",
--   "parking:lane:left:perpendicular",
--   "parking:lane:left:diagonal",
--   "parking:lane:right:parallel",
--   "parking:lane:right:perpendicular",
--   "parking:lane:right:diagonal",
--   "parking:lane:both:parallel",
--   "parking:lane:both:perpendicular",
--   "parking:lane:both:diagonal"
-- }

-- local rev_readable_attributes = {}
-- for _, k in ipairs(readable_attributes) do
--     rev_readable_attributes[k] = 1
-- end

function trim(s)
  return s:match "^()%s*$" and "" or s:match "^%s*(.*%S)"
end

function remove_whitespace(s)
  return s:gsub("%s+", "")
end

function parse_units(input)
  -- from osm2pgsql/flex-config/data-types.lua
  if not input then
    return nil
  end

  local width = tonumber(input)

  -- If width is just a number, just return it
  if width then
    return width
  end

  width = remove_whitespace(trim(input))
  -- If there is an 'cm', 'm', 'ft' at the end, remove unit and return
  if width:sub(-2) == "cm" then
    local num = tonumber(width:sub(1, -3))
    if num then
      return num / 100
    end
  end

  if width:sub(-1) == "m" then
    local num = tonumber(width:sub(1, -2))
    if num then
      return num
    end
  end

  if input:sub(-2) == 'ft' then
    local num = tonumber(input:sub(1, -3))
    if num then
      return num * 0.3048
    end
  end

  return nil
end

function Split(s, delimiter)
  result = {};
  for match in (s .. delimiter):gmatch("(.-)" .. delimiter) do
    table.insert(result, match);
  end
  return result;
end

function osm2pgsql.process_way(object)


  -- process public transport objects and push them to db table
  local public_transport = object.tags["public_transport"]
  if public_transport == "platform" then
    tables.pt_platform:add_row({
      name = object.tags["name"],
      bus = object.tags["bus"],
      tram = object.tags["tram"],
      railway = object.tags["railway"],
      highway = object.tags["highway"],
    })
    return
  end

  -- process parking objects and push them to db table
  local parking_amenity = object.tags["amenity"]
  if object.is_closed and parking_amenity == "parking" then
    tables.parking_poly:add_row({
      amenity = parking_amenity,
      access = object.tags["access"],
      capacity = parse_units(object.tags["capacity"]),
      building = object.tags["building"],
      parking = object.tags["parking"],
      parking_orientation = object.tags["parking:orientation"],
      parking_street_side_of = object.tags["parking:street_side:of"],
      parking_street_side_of_name = object.tags["parking:street_side:of:name"],
      geom = { create = 'area' }
    })
    return
  end

  -- process parking objects and push them to db table
  if object.is_closed and parking_amenity == "bicycle_parking" then
    tables.parking_poly:add_row({
      amenity = parking_amenity,
      access = object.tags["access"],
      capacity = parse_units(object.tags["capacity"]),
      parking = object.tags["bicycle_parking:position"],
      geom = { create = 'area' }
    })
    return
  end

  -- ignore all objects with area=yes from now
  if HasAreaTags(object.tags) then
    return
  end


  -- Get the type of "highway" and remove it from the tags
  local type = object.tags["highway"]

  -- We are only interested in highways of the given highway/service types
  if not highway_types[type] and not service_types[type] then
    return
  end
  -- if not rev_parking[parking_left] or not rev_parking[parking_right]  or not rev_parking[parking_both] then
  --     return
  -- end

  local pl_both = nil
  local pl_error_output = {}

  local name = object.tags["name"]

  local parking_left_position = object.tags["parking:lane:left:position"]
  local parking_right_position = object.tags["parking:lane:right:position"]
  local parking_left_width = object.tags["parking:lane:left:width"]
  local parking_right_width = object.tags["parking:lane:right:width"]
  local parking_left_width_carriageway = object.tags["parking:lane:left:width:carriageway"]
  local parking_right_width_carriageway = object.tags["parking:lane:right:width:carriageway"]
  local parking_left_offset = object.tags["parking:lane:left:offset"]
  local parking_right_offset = object.tags["parking:lane:right:offset"]

  local parking_condition_left = nil --object:grab_tag('parking:condition:left')
  local parking_condition_right = nil --object:grab_tag('parking:condition:right')
  local parking_condition_left_other = nil --object:grab_tag('parking:condition:left:other')
  local parking_condition_right_other = nil --object:grab_tag('parking:condition:right:other')
  local parking_condition_left_other_time = nil --object:grab_tag('parking:condition:left:other:time')
  local parking_condition_right_other_time = nil --object:grab_tag('parking:condition:right:other:time')
  local parking_condition_left_default = nil --object:grab_tag('parking:condition:left:default')
  local parking_condition_right_default = nil --object:grab_tag('parking:condition:right:default')
  local parking_condition_left_time_interval = nil --object:grab_tag('parking:condition:left:time_interval')
  local parking_condition_right_time_interval = nil --object:grab_tag('parking:condition:right:time_interval')
  local parking_condition_left_maxstay = nil --object:grab_tag('parking:condition:left:maxstay')
  local parking_condition_right_maxstay = nil --object:grab_tag('parking:condition:right:maxstay')
  local parking_lane_left_capacity = nil --object:grab_tag('parking:lane:left:capacity')
  local parking_lane_right_capacity = nil --object:grab_tag('parking:lane:right:capacity')

  local parking_condition_both = object.tags["parking:condition:both"]
  local parking_condition_both_other = object.tags["parking:condition:both:other"]
  local parking_condition_both_other_time = object.tags["parking:condition:both:other:time"]
  local parking_condition_both_default = object.tags["parking:condition:both:default"]
  local parking_condition_both_time_interval = object.tags["parking:condition:both:time_interval"]
  local parking_condition_both_maxstay = object.tags["parking:condition:both:maxstay"]
  local parking_lane_both_capacity = object.tags["parking:lane:both:capacity"]

  local constr = object.tags["construction"]

  local parking = nil
  local width_proc = nil
  --local parking_left_width_carriageway = nil
  --local parking_right_width_carriageway = nil


  -- Parkposition ermitteln (insbes. Straßen-/Bordsteinparken)
  for i, side in ipairs { "left", "right" } do
    local position = nil
    local parking_source_capacity = nil
    local parking_condition_side_default = nil
    local parking_condition_side = nil
    local parking_condition = nil
    local cond = nil
    local parking_condition_other_time = nil
    local parking_condition_other = nil
    local parking_side_position = nil

    local parking_lane_side = object.tags["parking:lane:" .. side]

    -- Parkausrichtung ermitteln (Längs-, Schräg-, Querparken)
    if object.tags["parking:lane:both"] ~= nil then
      pl_both = object.tags["parking:lane:both"]
      if parking_lane_side == nil then
        parking_lane_side = pl_both
      else
        table.insert(pl_error_output, {
          error = "pl01" .. side:sub(1),
          side = side:sub(1),
          msg = "Attribute 'parking:lane:" .. side .. "' und 'parking:lane:both' gleichzeitig vorhanden. "
        })
      end

    else
      if object.tags["parking:lane:" .. side] == nil then
        table.insert(pl_error_output, {
          error = "no_pl",
          side = side,
          msg = "Parkstreifeninformation nicht für alle Seiten vorhanden."
        })
      end
    end


    if parking_lane_side then
      local dir_side = rev_orientation[object.tags["parking:lane:" .. side]] == 1
      local dir_both = object.tags["parking:lane:both"] ~= nil

      if rev_parking[object.tags["parking:lane:" .. side]] then
        parking_source_capacity = 'estimated'
      end

      if dir_side then
        position = object.tags["parking:lane:" .. side .. ":" .. parking_lane_side]
      end

      if dir_both then
        if position then
          table.insert(pl_error_output, {
            error = "pl02" .. side:sub(1),
            side = side:sub(1),
            msg = "Attribute 'parking:lane:" ..
                side .. ":position und parking:lane:both:position gleichzeitig vorhanden."
          })
        end
        if not position then
          position = object.tags["parking:lane:both:" .. parking_lane_side]
        end
      end
      -- TODO error for no parking lanes

      if position == "lay_by" or position == "street_side" then
        parking = "street_side"
      else
        parking = "lane"
      end

      -- Parkstreifen-Regeln (und Abweichungen) ermitteln (kostenfrei, Ticket, Halte-/Parkverbote zu bestimmten Zeiten...)
      parking_condition_side_default = object.tags["parking:condition:" .. side .. ":default"]

      if parking_condition_both_default ~= nil then
        if parking_condition_side_default ~= nil then
          table.insert(pl_error_output, {
            error = "pc02" .. side:sub(1),
            side = side,
            msg = 'Attribute "parking:condition:' ..
                side .. ':default" und "parking:condition:both:default" gleichzeitig vorhanden. '
          })
        else
          parking_condition_side_default = parking_condition_both_default
        end
      end

      parking_condition_side = object.tags["parking:condition:" .. side]
      if parking_condition_side_default == nil then
        if parking_condition_side ~= nil and parking_condition_both ~= nil then
          table.insert(pl_error_output, {
            error = "pc02" .. side:sub(1),
            side = side,
            msg = 'Attribute "parking:condition:' .. side .. '" und "parking:condition:both" gleichzeitig vorhanden. '
          })
        end
        if parking_condition_side == nil then
          parking_condition = parking_condition_both
        end
      else
        parking_condition = parking_condition_side_default
        cond = parking_condition_side
        if cond and parking_condition_both then
          table.insert(pl_error_output, {
            error = "pc02" .. side:sub(1),
            side = side,
            msg = 'Attribute "parking:condition:' .. side .. '" und "parking:condition:both" gleichzeitig vorhanden. '
          })
        end
        if cond == nil then
          cond = parking_condition_both
        end
        if parking_condition_side ~= nil then
        end
        -- Mögliche conditional-Schreibweisen auflösen - Achtung, fehleranfällig, wenn andere conditions als Zeitangaben verwendet werden!
        if cond then
          -- Zeichen @ suchen
          pos = string.find(cond, '@')
          if pos == nil then
            -- Wert verwenden
            parking_condition_other = cond
          else
            -- Wert aufteilen in condition und Zeitangabe, Klammern beginnende/endende Leerzeichen entfernen
            splitstring = Split(cond, "@")
            parking_condition_other = trim(splitstring[1])
            parking_condition_other_time = trim(splitstring[2]):gsub("[()]", "")
          end
        end
      end
    end


    -- Segmente ignorieren, an denen ausschließlich Park- und Halteverbot besteht
    if (parking_condition == 'no_parking' and parking_condition_other == 'no_stopping') or
        (parking_condition == 'no_stopping' and parking_condition_other == 'no_parking') then
      return
    end
    local parking_condition_time_interval_side = object.tags['parking:condition:' .. side .. ':time_interval']
    if parking_condition_time_interval_side ~= nil then
      if parking_condition_other_time then
        table.insert(pl_error_output, {
          error = "pc03" .. side:sub(1),
          side = side,
          msg = ' Zeitliche Parkbeschränkung sowohl im conditional-restrictions- als auch im parking:lane:' ..
              side .. ':time_interval-Schema vorhanden. '
        })
      end
      parking_condition_other_time_set = parking_condition_time_interval_side
    else
      parking_condition_other_time_set = nil
    end

    if parking_condition_both_time_interval ~= nil then
      if parking_condition_other_time_set then
        table.insert(pl_error_output, {
          error = "pc04" .. side:sub(1),
          side = side,
          msg = ' Attribute "parking:condition:' ..
              side .. ':time_interval" und "parking:condition:both:time_interval" gleichzeitig vorhanden. '
        })
      end
      if parking_condition_other_time_set == nil then
        parking_condition_other_time_set = parking_condition_both_time_interval
      end
    end
    if parking_condition_other_time == nil then
      parking_condition_other_time = parking_condition_other_time_set
    end

    local parking_condition_maxstay_side = object.tags['parking:condition:' .. side .. ':maxstay']
    if parking_condition_both_maxstay ~= nil then
      if parking_condition_maxstay_side then
        table.insert(pl_error_output, {
          error = "pc05" .. side:sub(1),
          side = side,
          msg = ' Attribute "parking:condition:' ..
              side .. ':maxstay" und "parking:condition:both:maxstay" gleichzeitig vorhanden. '
        })
      else
        parking_condition_maxstay_side = object.tags['parking:condition:both:maxstay']
      end
    end

    local parking_lane_capacity_side = object.tags['parking:lane:' .. side .. ':capacity']
    if parking_lane_both_capacity ~= nil then
      if parking_lane_capacity_side ~= nil then
        table.insert(pl_error_output, {
          error = "pl01" .. side:sub(1),
          side = side,
          msg = 'Attribute "parking:lane:' ..
              side .. ':capacity" und "parking:lane:both:capacity" gleichzeitig vorhanden. '
        })
      else
        parking_capacity = object.tags['parking:lane:both:capacity']
      end
    else
      parking_capacity = parking_lane_capacity_side
    end
    if parking_capacity ~= nil then
      parking_source_capacity = 'OSM'
    end

    -- TODO
    -- Nicht berücksichtigte, spezielle parking:lane-Attribute erkennen und ausgeben
    -- for attr in layer_parking_left.attributeAliases():
    --     if 'parking:lane' in attr or 'parking:condition' in attr:
    --         if side == 'left':
    --             if not 'right' in attr and not attr in readable_attributes:
    --                 if feature.attribute(attr):
    --                     error += '[ig_al] Attribut "' + attr + '" nicht berücksichtigt. '
    --         elif side == 'right':
    --             if not 'left' in attr and not attr in readable_attributes:
    --                 if feature.attribute(attr):
    --                     error += '[ig_ar] Attribut "' + attr + '" nicht berücksichtigt. '


    if parking_lane_side then
      -- Parkstreifenbreite ermitteln
      parking_side_width = object.tags["parking:lane:" .. side .. ":width"]
      pakring_both_width = object.tags["parking:lane:both:width"]
      parking_side_position = object.tags["parking:" .. side .. ":" .. parking_lane_side]
      if pakring_both_width ~= nil then
        if parking_side_width == nil then parking_side_width = pakring_both_width
        else
          table.insert(pl_error_output, {
            error = "pl03" .. side:sub(1),
            side = side,
            msg = "Attribute 'parking:lane:" .. side .. ":width' und 'parking:lane:both:width' gleichzeitig vorhanden. "
          })
        end
      end
      -- Parkstreifenbreite aus Parkrichtung abschätzen, wenn nicht genauer angegeben
      if parking_side_width == nil then
        parking_side_width = 0
        if parking_lane_side == "parallel" then parking_side_width = width_para end
        if parking_lane_side == "diagonal" then parking_side_width = width_diag end
        if parking_lane_side == "perpendicular" then parking_side_width = width_perp end
      end
    end

    -- Offset der Parkstreifen für spätere Verschiebung ermitteln (offset-Linie liegt am Bordstein)
    local parking_side_width_carriageway = 0
    if rev_orientation[parking_lane_side] then
      parking_side_width_carriageway = parking_side_width
      if parking_side_position == "half_on_kerb" then
        parking_side_width_carriageway = parking_side_width_carriageway / 2
      end
      if rev_position[parking_side_position] then
        parking_side_width_carriageway = 0
      end
    end
    if side == "left" then
      parking_left = parking_lane_side
      parking_left_position = position
      parking_left_width = parking_side_width
      parking_left_width_carriageway = parking_side_width_carriageway
      parking_condition_left_default = parking_condition_side_default
      parking_condition_left = parking_condition
      parking_condition_left_other = parking_condition_other
      parking_condition_left_other_time = parking_condition_other_time
      parking_condition_left_maxstay = parking_condition_maxstay_side
      parking_lane_left_capacity = parking_capacity
      parking_lane_left_source_capacity = parking_source_capacity

    else
      parking_right = parking_lane_side
      parking_right_position = position
      parking_left_width = parking_side_width
      parking_right_width_carriageway = parking_side_width_carriageway
      parking_condition_right_default = parking_condition_side_default
      parking_condition_right = parking_condition
      parking_condition_right_other = parking_condition_other
      parking_condition_right_other_time = parking_condition_other_time
      parking_condition_right_maxstay = parking_condition_maxstay_side
      parking_lane_right_capacity = parking_capacity
      parking_lane_right_source_capacity = parking_source_capacity

    end

  end

  -- Fahrbahnbreite ermitteln

  -- Mögliche vorhandene Breitenattribute prüfen: width:carriageway, width, est_width
  local width = object.tags["width:carriageway"]

  if width == nil then width = object.tags["width"] end
  if width == nil then width = object.tags["est_width"] end
  -- Einheiten korrigieren
  if width ~= nil and parse_units(width) ~= nil then width = parse_units(width)
    -- Ansonsten Breite aus anderen Straßenattributen abschätzen
  else
    highway = object.tags["highway"]
    if highway == "primary" then width = width_primary_street end
    if highway == "secondary" then width = width_secondary_street end
    if highway == "tertiary" then width = width_tertiary_street end
    if service_types[highway] then
      width = width_service
      if object.tags["service"] == "driveway" then
        width = width_driveway
      end
    end
    if highway == "construction" then
      if constr ~= nil then
        construction = object.tags["highway"]
        if construction == "primary" then width = width_primary_street end
        if construction == "secondary" then width = width_secondary_street end
        if construction == "tertiary" then width = width_tertiary_street end
        if service_types[construction] then
          width = width_service
        end
      end
    end
    if parse_units(width) == nil then width = width_minor_street end
  end
  width_proc = width

  --print(width, width_effective, parking_left_width_carriageway, parking_right_width_carriageway)
  local width_effective = tonumber(width) - tonumber(parking_left_width_carriageway) -
      tonumber(parking_right_width_carriageway)
  parking_left_offset = (width_effective / 2) + tonumber(parking_left_width_carriageway)
  parking_right_offset = -(width_effective / 2) - tonumber(parking_right_width_carriageway)


  if highway_types[type] then
    tables.highways:add_row {
      type                                  = type,
      surface                               = object.tags["surface"],
      name                                  = name,
      service                               = object.tags["service"],
      oneway                                = object.tags["oneway"],
      dual_carriageway                      = object.tags["dual_carriageway"],
      lanes                                 = parse_units(object.tags["lanes"]),
      width                                 = parse_units(object.tags["width"]),
      parking                               = parking,
      parking_lane_left                     = parking_left,
      parking_lane_right                    = parking_right,
      parking_lane_width_proc               = width_proc,
      parking_lane_width_effective          = width_effective,
      parking_lane_left_position            = parking_left_position,
      parking_lane_right_position           = parking_right_position,
      parking_lane_left_width               = parking_left_width,
      parking_lane_right_width              = parking_right_width,
      parking_lane_left_width_carriageway   = parking_left_width_carriageway,
      parking_lane_right_width_carriageway  = parking_right_width_carriageway,
      parking_lane_left_offset              = parking_left_offset,
      parking_lane_right_offset             = parking_right_offset,
      error_output                          = json.encode(pl_error_output),
      parking_condition_left                = parking_condition_left,
      parking_condition_left_other          = parking_condition_left_other,
      parking_condition_right               = parking_condition_right,
      parking_condition_right_other         = parking_condition_right_other,
      parking_condition_left_other_time     = parking_condition_left_other_time,
      parking_condition_right_other_time    = parking_condition_right_other_time,
      parking_condition_left_default        = parking_condition_left_default,
      parking_condition_right_default       = parking_condition_right_default,
      parking_condition_left_time_interval  = parking_condition_left_time_interval,
      parking_condition_right_time_interval = parking_condition_right_time_interval,
      parking_condition_left_maxstay        = parking_condition_left_maxstay,
      parking_condition_right_maxstay       = parking_condition_right_maxstay,
      parking_lane_left_capacity            = parking_lane_left_capacity,
      parking_lane_right_capacity           = parking_lane_right_capacity,
      parking_lane_left_source_capacity     = parking_lane_left_source_capacity,
      parking_lane_right_source_capacity    = parking_lane_right_source_capacity
    }

  else
    if service_types[type] then
      tables.service:add_row {
        type                                  = type,
        surface                               = object.tags["surface"],
        name                                  = name,
        service                               = object.tags["service"],
        oneway                                = object.tags["oneway"],
        dual_carriageway                      = object.tags["dual_carriageway"],
        lanes                                 = parse_units(object.tags["lanes"]),
        width                                 = parse_units(object.tags["width"]),
        parking                               = parking,
        parking_lane_left                     = parking_left,
        parking_lane_right                    = parking_right,
        parking_lane_width_proc               = width_proc,
        parking_lane_width_effective          = width_effective,
        parking_lane_left_position            = parking_left_position,
        parking_lane_right_position           = parking_right_position,
        parking_lane_left_width               = parking_left_width,
        parking_lane_right_width              = parking_right_width,
        parking_lane_left_width_carriageway   = parking_left_width_carriageway,
        parking_lane_right_width_carriageway  = parking_right_width_carriageway,
        parking_lane_left_offset              = parking_left_offset,
        parking_lane_right_offset             = parking_right_offset,
        error_output                          = json.encode(pl_error_output),
        parking_condition_left                = parking_condition_left,
        parking_condition_left_other          = parking_condition_left_other,
        parking_condition_right               = parking_condition_right,
        parking_condition_right_other         = parking_condition_right_other,
        parking_condition_left_other_time     = parking_condition_left_other_time,
        parking_condition_right_other_time    = parking_condition_right_other_time,
        parking_condition_left_default        = parking_condition_left_default,
        parking_condition_right_default       = parking_condition_right_default,
        parking_condition_left_time_interval  = parking_condition_left_time_interval,
        parking_condition_right_time_interval = parking_condition_right_time_interval,
        parking_condition_left_maxstay        = parking_condition_left_maxstay,
        parking_condition_right_maxstay       = parking_condition_right_maxstay,
        parking_lane_left_capacity            = parking_lane_left_capacity,
        parking_lane_right_capacity           = parking_lane_right_capacity,
        parking_lane_left_source_capacity     = parking_lane_left_source_capacity,
        parking_lane_right_source_capacity    = parking_lane_right_source_capacity
      }
    end
  end

end

function osm2pgsql.process_node(object)

  local crossing_check = object.tags["crossing"]

  -- if not crossing_types[crossing_check] then
  --     return
  -- end

  --    print("nodes",object.tags["crossing"], rev_crossing_exclude_values[crossing_check], object.tags.highway)
  if object.tags.highway == "traffic_signals" or object.tags.highway == "crossing" then
    if rev_crossing_exclude_values[crossing_check] == nil --or object.tags["crossing:buffer_marking"] ~= nil or object.tags["crossing:kerb_extension"] ~= nil
    then
      --print("add row")
      tables.crossings:add_row({
        highway = object.tags["highway"],
        crossing = object.tags["crossing"],
        crossing_ref = object.tags["crossing_ref"],
        kerb = object.tags["kerb"],
        crossing_buffer_marking = object.tags["crossing:buffer_marking"],
        crossing_kerb_extension = object.tags["crossing:kerb_extension"],
        traffic_signals_direction = object.tags["traffic_signals:direction"],
      })
    end
  end

  if object.tags.highway == "bus_stop" or object.tags.public_transport == "stop_position" then
    --print("add row")
    tables.pt_stops:add_row({
      highway = object.tags["highway"],
      name = object.tags["name"],
      public_transport = object.tags["public_transport"],
      bus = object.tags["bus"],
      tram = object.tags["tram"],
      railway = object.tags["railway"],
      subway = object.tags["subway"],
      light_rail = object.tags["light_rail"],
    })
  end

  -- if object.tags.emergency == "fire_hydrant" then
  --     tables.hydrant:add_row{
  --       emergency = object.tags["emergency"],
  --       fire_hydrant_type = object.tags["fire_hydrant:type"],
  --       fire_hydrant_position = object.tags["fire_hydrant:position"],
  --       fire_hydrant_diameter = object.tags["fire_hydrant:diameter"],
  --       ref = object.tags["ref"],
  --     }
  -- end
  if object.tags.ramp == "yes" then
    tables.ramps:add_row {
      operator = object.tags["operator"],
      kerb = object.tags["kerb"],
    }
  end

  if object.tags.traffic_calming ~= nil then
    tables.traffic_calming_points:add_row {
      traffic_calming = object.tags["traffic_calming"],
      priority = object.tags["priority"],
    }
  end

  -- process parking objects and push them to db table
  local parking_amenity = object.tags["amenity"]
  if (parking_amenity == "bicycle_parking" and rev_bicycle_parking_position[object.tags["bicycle_parking:position"]])
      or parking_amenity == "small_vehicle_parking" then
    tables.amenity_parking_points:add_row({
      amenity = parking_amenity,
      access = object.tags["access"],
      capacity = parse_units(object.tags["capacity"]),
      bicycle = object.tags["bicycle"],
      small_electric_vehicle = object.tags["small_electric_vehicle"],
      small_vehicle_parking_position = object.tags["small_vehicle_parking:position"],
      parking = object.tags["bicycle_parking"],
      parking_position = object.tags["bicycle_parking:position"]
    })
    return
  end

end
