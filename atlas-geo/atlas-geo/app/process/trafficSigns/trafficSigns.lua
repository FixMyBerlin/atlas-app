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
local trafficSignWays = osm2pgsql.define_table({
  name = '_trafficSigns_tmp',
  ids = { type = 'way', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'linestring' },
  }
})

local directionTable = osm2pgsql.define_table({
  name = '_trafficSignDirections',
  ids = { type = 'way', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'node_id', type = 'int' },
    { column = 'root', type = 'int' },
    { column = 'direction', type = 'int' },
    { column = 'geom', type = 'linestring' },
  }
})

local function splitDirections(tags)
  local directionOffsets = { ["forward"] = 0, ["backward"] = 180 }
  local traffic_signs = {}
  for direction, offset in pairs(directionOffsets) do
    local directedTag = "traffic_sing:" .. direction
    if tags[directedTag] then
      traffic_signs[direction] = { ["traffic_sign"] = tags[directedTag], ["offset"] = offset }
    elseif tags.direction == direction or tags["traffic_sign:direction"] == direction then
      traffic_signs[direction] = { ["traffic_sign"] = tags.traffic_sign, ["offset"] = offset }
    end
  end
  if traffic_signs.forward == nil and traffic_signs.backward == nil then
    traffic_signs.forward = { ["traffic_sign"] = tags.traffic_sign, ["offset"] = 0 }
  end
  return { [1] = traffic_signs.forward, [2] = traffic_signs.backward }
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

local toDirect = {}

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  local tags = object.tags
  if tags.direction ~= nil then
    local direction = tonumber(tags.direction)
    if direction == nil then
      direction = cardinalDirection2Degree(tags.direction)
    end
    if direction ~= nil then
      tags.direction = tags.direction
    else
      toDirect[object.id] = true
    end
  end
  for _, traffic_sign in pairs(splitDirections(tags)) do
    table:insert({
      tags = traffic_sign,
      meta = Metadata(object),
      geom = object:as_point()
    })
  end
end

-- function osm2pgsql.process_way(object)
--   local anterior, sign, posterior = nil, nil, nil
--   local node_id = nil
--   for idx, id in pairs(object.nodes) do
--     if sign == nil then 
--       if toDirect[id] then
--         sign = idx
--         node_id = id
--       else
--         anterior = idx
--       end
--     elseif posterior == nil then
--       posterior = idx
--     end
--   end
--   if node_id ~= nil then
--     print("Found sign indices")
--     if anterior ~= nil then
--       directionTable:insert({
--         node_id = node_id,
--         root = anterior,
--         direction = sign,
--         geom = object:as_linestring()
--       })
--     end
--     if posterior ~= nil then
--       directionTable:insert({
--         node_id = node_id,
--         root = sign,
--         direction = posterior,
--         geom = object:as_linestring()
--       })
--     end
--   end
--   if ExitProcessing(object) then return end
--   if object.is_closed or object.tags.traffic_sing == 'None' then return end
  
--   trafficSignWays:insert({
--     tags = object.tags,
--     meta = Metadata(object),
--     geom = object:as_linestring(),
--   })
-- end
