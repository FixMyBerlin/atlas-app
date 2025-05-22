local round = require('round')

local function capacity_from_tag(tags, area)
    if type(tonumber(tags.capacity)) == "number" then
        return {
            area = round(area, 2),
            capacity = tonumber(tags.capacity),
            capacity_confidence = 'high',
            capacity_source = 'tag',
        }
    end
    return nil
end

return capacity_from_tag
