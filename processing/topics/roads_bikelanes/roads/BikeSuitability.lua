package.path = package.path .. ";/processing/topics/roads_bikelanes/bikelanes/categories/?.lua"
package.path = package.path .. ";/processing/topics/helper/?.lua"
require("ContainsSubstring")
require("IsSidepath")
require("CreateSubcategoriesAdjoiningOrIsolated")
require("SanitizeTrafficSign")
require("DeriveSmoothness")
require("HighwayClasses")

BikeSuitability = {}
BikeSuitability.__index = BikeSuitability

-- @param args table
-- @param args.desc string
-- @param args.condition function
-- @param args.insfrastructureExists boolean
-- @param args.implicitOneWay boolean
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

-- Paths which have a surface which is suited for biking
local goodSurface = BikeSuitability.new({
  id = 'goodSurface',
  desc = 'Paths which have a surface which is suited for biking.',
  infrastructureExists = true,
  implicitOneWay = false, -- path shared, both lanes
  condition = function(tags)
    if tags.surface ~= 'asphalt' then
      return false
    end
    if not Set({'path', 'track'})[tags.highway] then
      return false
    end
    local smoothness = DeriveSmoothness(tags).smoothness
    if smoothness == nil or smoothness == 'bad' or smoothness == 'very_bad' then
      return false
    end
    return true
  end
})

-- Ways which have no motorized vehicle access
local noMotorizedVehicle = BikeSuitability.new({
  id = 'noMotorizedVehicle',
  desc = 'Ways which have a surface which have no vehicle access except bicycles.',
  condition = function(tags)
    if not PathClasses[tags.highway] then
      return false
    end
    local traffic_sign = SanitizeTrafficSign(tags.traffic_sign)
    if not (ContainsSubstring(traffic_sign, '260') or ContainsSubstring(traffic_sign, '250') or tags.motor_vehicle == 'no')then
      return false
    end
    return true
  end
})

-- This is where we collect bike lanes that do not have sufficient tagging to be categorized well.
-- They are in OSM, but they need to be improved, which we show in the UI.
local noOvertaking = BikeSuitability.new({
  id = 'noOvertaking',
  desc = 'Shared lane with over taking prohibition for motorized vehicles.',
  condition = function(tags)
    local traffic_sign = SanitizeTrafficSign(tags.traffic_sign)
    if ContainsSubstring(traffic_sign, "DE:277.1") then
      return true
    end
  end
})

-- https://wiki.openstreetmap.org/wiki/DE:Tag:highway=living_street
local livingStreet = BikeSuitability.new({
  id = 'livingStreet',
  desc = 'Living streets are considered bike friendly unless prohibided.' ..
      ' (DE: "Verkehrsberuhigter Bereich" AKA "Spielstraße")',
  condition = function(tags)
    if tags.highway == "living_street" then
      -- Exit if all vehicle are prohibited (but don't exit if bikes are allowed)
      if tags.vehicle == "no" and not (tags.bicycle == "yes" or tags.bicycle == "designated") then
        return nil
      end
      -- Exit if bikes are prohibited
      if tags.bicycle == "no" or tags.bicycle == "dismount" then
        return nil
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
