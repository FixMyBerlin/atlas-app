package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Set")
require("Sanitize")

---@param category table
---@return 'yes' | 'no' | 'car_not_bike' | 'assumed_no' | 'implicit_yes' | 'unknown'
--- Derive oneway information based on tags and given category
function DeriveOneway(tags, category)
  -- if `oneway:bicycle` is explicitly tagged check if it differs from `oneway`
  if tags['oneway:bicycle'] == 'yes' then
    return 'yes'
  elseif tags['oneway:bicycle'] == 'no' then
    if tags.oneway == 'yes' then
      return 'car_not_bike'
    else
      return 'no'
    end
  end

  if Sanitize(tags.oneway, { 'yes', 'no' }) then
    return tags.oneway
  end

  if category.implicitOneWay then
    return 'implicit_yes'
  end

  return 'assumed_no'
end
