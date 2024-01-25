package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/?.lua"
require("Set")
require("HighwayClasses")
require("TimeUtils")
require("categories")
require("transformations")
require("CopyTags")
require("RoadWidth")
require("ToMarkdownList")
require("DeriveSurface")
require("DeriveSmoothness")
require("BikelanesTodos")


-- these tags are copied (Eigennamen)
local allowed_tags = {
  "name",
}
-- these tags are copied and prefixed with `osm_`
local tags_cc = {
  'surface:colour',
  'traffic_sign',
  'traffic_sign:forward',
  'traffic_sign:backward',
  'separation',
  'separation:left',
  'separation:right',
  'traffic_mode',
  'traffic_mode:left',
  'traffic_mode:right',
  "mapillary",
  "description",
}

function Bikelanes(object, road)
  local tags = object.tags

  -- transformations
  local footwayTransformation = {
    highway = "footway",
    prefix = "sidewalk",
    filter = function(tags)
      return not (tags.footway == 'no' or tags.footway == 'separate')
    end
  }
  -- cycleway transformer:
  local cyclewayTransformation = {
    highway = "cycleway",
    prefix = "cycleway",
  }
  local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence

  -- generate cycleways from center line tagging, also includes the original object with `sign = 0`
  local transformedObjects = GetTransformedObjects(tags, transformations)
  local width = RoadWidth(tags)
  local bikelanes = {}
  for i, cycleway in pairs(transformedObjects) do
    local sign = cycleway.sign
    local onlyPresent = OnlyPresent(cycleway) -- these are categories defining the presence of data
    if onlyPresent ~= nil then
      bikelanes[i] = { onlyPresent = true, category = onlyPresent, sign = sign }
    else
      local category = CategorizeBikelane(cycleway)
      if category ~= nil then
        -- === Processing on the whole dataset ===
        -- cycleway._todos = ToMarkdownList(BikelanesTodos(cycleway))
        local smoothness_data = DeriveSmoothness(cycleway)
        local surface_data = DeriveSurface(cycleway)

        -- Our atlas-app inspector should be explicit about tagging that OSM considers default/implicit
        local oneway = nil
        if cycleway.oneway == nil then
          if tags.bicycle_road == 'yes' then
            oneway = 'implicit_no'
          else
            oneway = 'implicit_yes'
          end
        end

        -- === Processing on the transformed dataset ===
        local freshTag = "check_date"
        if sign == CENTER_SIGN then
          -- if we're dealing with the original object (center line) then only keep all the tags from the `tags_cc` list and prefix them
          -- due to that it's important that the precceding operations happen before
          cycleway = { sign = CENTER_SIGN, width = ParseLength(tags.width) }
          cycleway = CopyTags(cycleway, tags, allowed_tags)
          cycleway = CopyTags(cycleway, tags, tags_cc, 'osm_')
        else
          freshTag = "check_date:" .. cycleway.prefix
        end

        if tags[freshTag] then
          cycleway.age = AgeInDays(ParseDate(tags[freshTag]))
        end

        -- Sanitize tags
        cycleway = CopyTags(cycleway, tags, tags_cc, 'osm_')
        cycleway.width = ParseLength(cycleway.width)
        cycleway.category = category
        cycleway.offset = sign * width / 2
        cycleway.road = road
        cycleway.oneway = oneway
        MergeTable(cycleway, surface_data)
        MergeTable(cycleway, smoothness_data)
        -- Unsanitized tags
        cycleway = CopyTags(cycleway, tags, allowed_tags)

        bikelanes[i] = cycleway
      end
    end
  end

  return bikelanes
end
