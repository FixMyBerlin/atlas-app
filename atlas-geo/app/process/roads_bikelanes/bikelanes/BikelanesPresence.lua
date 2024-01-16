package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
require("HighwayClasses")

function BikelanesPresence(object, cycleways)
  local tags = object.tags
  local presence = {}
  local sides = { LEFT_SIGN, CENTER_SIGN, RIGHT_SIGN }
  for _, cycleway in pairs(cycleways) do
    local sign = cycleway.sign
    if not cycleway.onlyPresent then
      presence[sign] = presence[sign] or cycleway.category
      -- TODO: I keept the line above to stay consitent with the former implementation but IMO we should give the "real" categories precedence over the "onlyPresent"
      -- presence[sign] = cycleway.category
    else
      presence[sign] = presence[sign] or cycleway.category
    end
  end
  -- Filter ways where we dont expect bicycle infrastructure
  -- TODO: filter on surface and traffic zone and maxspeed (maybe wait for maxspeed PR)
  if (MinorRoadClasses[tags.highway] and tags.highway ~= 'service') or presence[CENTER_SIGN] then
    -- set the nil values to 'not_expected', for all minor roads and complete data
    for _, side in pairs(sides) do presence[side] = presence[side] or NOT_EXPECTED end
  elseif not (presence[CENTER_SIGN] or presence[RIGHT_SIGN] or presence[LEFT_SIGN]) then
    if not MajorRoadClasses[tags.highway] then
      -- no infrastructure expected for major highway types
      return {}
    elseif tags.motorroad or tags.expressway then
      -- no infrastructure expected for motorroad and express way
      return {}
      -- elseif tags.maxspeed and tags.maxspeed <= 20 then
      --   no infrastructure expected for max speed <= 20 kmh
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

  local presence_data = {
    bikelane_left = presence[LEFT_SIGN],
    bikelane_self = presence[CENTER_SIGN],
    bikelane_right = presence[RIGHT_SIGN]
  }
  CopyTags(presence_data, tags, presence_tags_cc, "osm_")

  return presence_data
end
