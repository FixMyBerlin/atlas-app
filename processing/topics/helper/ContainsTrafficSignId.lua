require('init')
require("ContainsSubstring")
require("SanitizeTrafficSign")

---@param trafficSign string
---@param trafficSignId string
---@return boolean
function ContainsTrafficSignId(trafficSign, trafficSignId)
  local cleanTrafficSign = SanitizeTrafficSign(trafficSign)
  return ContainsSubstring(cleanTrafficSign, 'DE:' .. trafficSignId)
        or ContainsSubstring(cleanTrafficSign, ';' .. trafficSignId)
        or ContainsSubstring(cleanTrafficSign, ',' .. trafficSignId)
end
