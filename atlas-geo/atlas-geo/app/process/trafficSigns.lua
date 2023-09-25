package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("Metadata")

local table = osm2pgsql.define_table({
  name = 'trafficSigns',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb' },
    { column = 'geom', type = 'point' },
  }
})

local function splitByDirection(tags)
  local directionOffsets = {["forward"] = 0, ["backward"] = 180}
  local traffic_signs = {}
  for direction, offset in pairs(directionOffsets) do
    local directedTag = "traffic_sing:".. direction
    if tags[directedTag] then
      traffic_signs[direction] = {["traffic_sign"] = tags[directedTag], ["offset"] = offset}
    elseif tags.direction == direction or tags["traffic_sign:direction"] == direction then
      traffic_signs[direction] = {["traffic_sign"] = tags.traffic_sign, ["offset"] = offset}
    end
  end
  if traffic_signs.forward == nil and traffic_signs.backward == nil then
    traffic_signs.forward = {["traffic_sign"] = tags.traffic_sign, ["offset"] = 0}
  end
  return traffic_signs.forward, traffic_signs.backward
end

local function translateDirection(direction)
  local directionMap ={
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


function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end
  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

-- function osm2pgsql.process_way(object)
--     if ExitProcessing(object) then return end
--   if not object.is_closed then return end



--   table:insert({
--     tags = object.tags,
--     meta = Metadata(object),
--     geom = object:as_polygon():centroid()
--   })
-- end
