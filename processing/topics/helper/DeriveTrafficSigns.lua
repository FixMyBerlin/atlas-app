package.path = package.path .. ";/processing/topics/helper/?.lua"

require("SanitizeTrafficSign")

function DeriveTrafficSigns(tags)
  local results = {
    ['traffic_sign'] = SanitizeTrafficSign(tags.traffic_sign) or SanitizeTrafficSign(tags['traffic_sign:both']),
    ['traffic_sign:forward'] = SanitizeTrafficSign(tags['traffic_sign:forward']),
    ['traffic_sign:backward'] = SanitizeTrafficSign(tags['traffic_sign:backward'])
  }
  return results
end
