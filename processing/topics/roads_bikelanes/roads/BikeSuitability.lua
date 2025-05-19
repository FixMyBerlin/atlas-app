package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
package.path = package.path .. ";/processing/topics/helper/?.lua"
require("ContainsSubstring")
require("DeriveSmoothness")
require("ContainsTrafficSignId")

BikeSuitability = {}
BikeSuitability.__index = BikeSuitability

-- @param args table
-- @param args.desc string
-- @param args.condition function
function BikeSuitability.new(args)
  local self = setmetatable({}, BikeSuitability)
  local fields = {'id', 'desc', 'condition'}
  for _, v in pairs(fields) do
    if args[v] == nil then
      error('Missing field "' .. v .. '" for BikeSuitability "' .. args.id .. '"')
    end
    self[v] = args[v]
  end
  return self
end

function BikeSuitability:__call(tags)
  return self.condition(tags)
end

local goodSurface = BikeSuitability.new({
  id = 'goodSurface',
  desc = 'Paths which have a surface which is suited for biking.',
  condition = function(tags)
    if tags.highway == "track" or tags.highway == "path"  then
      local smoothness = DeriveSmoothness(tags).smoothness
      if smoothness == nil or smoothness == 'bad' or smoothness == 'very_bad' then
        return false
      end
      return true
    end
  end
})

local noMotorizedVehicle = BikeSuitability.new({
  id = 'noMotorizedVehicle',
  desc = 'Track-like ways which disallow vehicles are bike friendly and can potentially be developed into bike infrastructure.',
  condition = function(tags)
    if tags.highway == "track" or tags.highway == "service"  then
      -- https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:250
      -- This includes bike. However the sign is often used incorrectly; and this is a "suitability" category which indicates that the signs could be changed
      if tags.vehicle == 'no'
        or ContainsSubstring(tags.vehicle, 'delivery')
        or ContainsSubstring(tags.vehicle, 'destination')
        or ContainsTrafficSignId(tags.traffic_sign, '250') then
        return true
      end
      -- https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:260
      if tags.motor_vehicle == 'no'
        or ContainsSubstring(tags.motor_vehicle, 'delivery')
        or ContainsSubstring(tags.motor_vehicle, 'destination')
        or ContainsTrafficSignId(tags.traffic_sign, '260') then
          return true
      end
      -- https://trafficsigns.osm-verkehrswende.org/DE?signs=DE:251
      if tags.motorcar == 'no'
        or ContainsSubstring(tags.motorcar, 'delivery')
        or ContainsSubstring(tags.motorcar, 'destination')
        or ContainsTrafficSignId(tags.traffic_sign, '251') then
        return true
      end
    end
  end
})

local noOvertaking = BikeSuitability.new({
  id = 'noOvertaking',
  desc = 'Shared lane with overtaking prohibition for motor vehicles indicate that someone tried to make this infrastructure bike friendly.',
  condition = function(tags)
    if ContainsTrafficSignId(tags.traffic_sign, "277.1") then
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=living_street
local livingStreet = BikeSuitability.new({
  id = 'livingStreet',
  desc = 'Living streets are considered bike friendly unless prohibited.' ..
      ' (DE: "Verkehrsberuhigter Bereich" AKA "Spielstraße")',
  condition = function(tags)
    if tags.highway == "living_street" then
      -- Exit if all vehicle are prohibited (but don't exit if bikes are allowed)
      if tags.vehicle == "no" and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
        return false
      end
      -- Exit if bikes are prohibited
      if tags.bicycle == "no" or tags.bicycle == "dismount" then
        return false
      end
      return true
    end
  end
})

-- The order specifies the precedence; first one with a result win.
local categoryDefinitions = {
  livingStreet,
  goodSurface,
  noMotorizedVehicle,
  noOvertaking,
}

function CategorizeBikeSuitability(tags)
  for _, category in pairs(categoryDefinitions) do
    if category(tags) then
      return category
    end
  end
  return nil
end
