package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("Metadata")

local table = osm2pgsql.define_table({
  name = 'trafficSigns',
  ids = { type = 'node', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

-- local trafficSignWays = osm2pgsql.define_table({
--   name = '_trafficSigns_tmp',
--   ids = { type = 'way', id_column = 'osm_id', type_column = 'osm_type' },
--   columns = {
--     { column = 'tags', type = 'jsonb' },
--     { column = 'meta', type = 'jsonb' },
--     { column = 'geom', type = 'linestring' },
--   }
-- })

-- This table collects information about traffic signs, which are oriented by the way the belong to
-- assuming that every traffic sign belongs to at most one way this table can hold up to two entries per traffic sign.
-- That is one for its predecessor and an other for its successor. Traffic signs located at the beginning or end of a way only have one such entry.
-- A single entry holds the osm id of the traffic sign as `node_id`, and one index from which the angle is to be taken (in way direction)
local directionTable = osm2pgsql.define_table({
  name = '_trafficSignDirections',
  ids = { type = 'way', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'node_id', type = 'bigint' },
    { column = 'idx', type = 'int' },
    { column = 'geom', type = 'linestring' },
  }
})

-- this function is for splitting traffic signs which are tagged with the :forward :backward sign e.g. nodes containing information about two traffic signs
-- the idea is to include two db entries where the traffic_sign:backward entry is rotated by 180 degrees
local function splitDirections(tags)
  local directionOffsets = { ["forward"] = 0, ["backward"] = 180 }
  local traffic_signs = {}
  for direction, offset in pairs(directionOffsets) do
    local directedTag = "traffic_sing:" .. direction
    local both = "traffic_sing:both"
    if tags[directedTag] or tags[both] then
      traffic_signs[direction] = { ["traffic_sign"] = tags[directedTag] or tags[both], ["offset"] = offset, direction=tags.direction }
    elseif tags.direction == direction or tags.direction=="both" then
      traffic_signs[direction] = { ["traffic_sign"] = tags.traffic_sign, ["offset"] = offset }
    end
  end
  if traffic_signs.forward == nil and traffic_signs.backward == nil then
    traffic_signs.forward = { ["traffic_sign"] = tags.traffic_sign, ["offset"] = 0, direction=tags.direction }
  end
  return { traffic_signs.forward, traffic_signs.backward }
end

local function cardinalDirection2Degree(direction)
  local directionMap = {
    ["north"] = 0,
    ["east"] = 90,
    ["south"] = 180,
    ["west"] = 270,
    ["N"] = 0,
    ["NNE"] = 22,
    ["NE"] = 45,
    ["ENE"] = 67,
    ["E"] = 90,
    ["ESE"] = 112,
    ["SE"] = 135,
    ["SSE"] = 157,
    ["S"] = 180,
    ["SSW"] = 202,
    ["SW"] = 225,
    ["WSW"] = 247,
    ["W"] = 270,
    ["WNW"] = 292,
    ["NW"] = 315,
    ["NNW"] = 337
  }
  return directionMap[direction]
end

local function ExitProcessing(object)
  local required_tags = { "traffic_sign", "traffic_sign:froward", "traffic_sign:backward" }
  for _, tag in pairs(required_tags) do
    if object.tags[tag] then
      return false
    end
  end
  return true
end

local to_orient = {}

-- TODO: add a direction_source tag
function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  local tags = object.tags

  tags.direction = tags.direction or tags['traffic_sign:direction'] -- the tag `traffic_sign:direction` depicts the same as `direction` (give the original precedence)
  if tags.direction ~= nil then
    -- orinetation is given in degree
    local direction = tonumber(tags.direction)
    if direction == nil then
      -- orientation is given by a cardinal direction e.g. NW 
      direction = cardinalDirection2Degree(tags.direction)
    end
    if direction ~= nil then -- one of the previous cases worked and we have a direction in degrees
      tags.direction = direction
    else -- we don't have a direction in degrees and now try to orient the traffic sign by the way it is part of
      to_orient[object.id] = true
    end
  end
  for _, traffic_sign in pairs(splitDirections(tags)) do -- here we possibly duplicate a node due to the possibility of two traffic signs per node
    table:insert({
      tags = traffic_sign,
      meta = Metadata(object),
      geom = object:as_point()
    })
  end
end

function osm2pgsql.process_way(object)
  local prev_idx = nil
  local prev_was_sign = false
  local prev_node_id = nil
  local is_sign = false
  -- TODO: guard one highway
  for idx, id in pairs(object.nodes) do
    is_sign = to_orient[id]
    if is_sign then
      if prev_idx ~= nil then
        directionTable:insert({
          node_id = id,
          idx = prev_idx,
          geom = object:as_linestring()
        })
      end
    end
    if prev_was_sign then
      directionTable:insert({
        node_id = prev_node_id,
        idx = prev_idx,
        geom = object:as_linestring()
      })
    end
    prev_idx = idx
    prev_node_id = id
    prev_was_sign = is_sign
  end
  -- if ExitProcessing(object) then return end
  -- if object.is_closed or object.tags.traffic_sing == 'None' then return end

  -- trafficSignWays:insert({
  --   tags = object.tags,
  --   meta = Metadata(object),
  --   geom = object:as_linestring(),
  -- })
end
