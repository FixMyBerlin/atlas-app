package.path = package.path .. ";/app/process/helper/?.lua"
package.path = package.path .. ";/app/process/shared/?.lua"
package.path = package.path .. ";/app/process/roads_bikelanes/bikelanes/?.lua"
require("Set")
require("TimeUtils")
require("categories")
require("transformations")
require("CopyTags")
require("RoadWidth")
require("ToMarkdownList")
require("DeriveSurface")
require("DeriveSmoothness")
require("BikelanesTodos")
require("Sanitize")
require("InferOneway")

local tags_copied = {
  "mapillary",
  "description",
}
local tags_prefixed = {
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
}

function Bikelanes(object)
  local tags = object.tags
  local result_bikelanes = {}

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

  -- generate cycleways from center line tagging, also includes the original object with `sign = 0`
  local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence
  local transformedObjects = GetTransformedObjects(tags, transformations)

  for i, cycleway in pairs(transformedObjects) do
    local sign = cycleway.sign
    local onlyPresent = CategorizeOnlyPresent(cycleway)
    if onlyPresent ~= nil then
      result_bikelanes[i] = { _infrastructureExists = false, category = onlyPresent, sign = sign }
    else
      local category = CategorizeBikelane(cycleway)
      if category ~= nil then
        local result_tags = {
          _infrastructureExists = true,
          category = category,
          offset = sign * RoadWidth(tags) / 2, -- TODO: Should be `_offset`
        }

        -- Our data should be explicit about tagging that OSM considers default/implicit as well assumed defaults.
        result_tags.oneway = Sanitize(cycleway.oneway, Set({ 'yes', 'no' })) or InferOneway(category)

        -- === Processing on the transformed dataset ===
        local freshTag = "check_date"
        if sign == CENTER_SIGN then
          result_tags.sign = CENTER_SIGN
          result_tags.width = ParseLength(tags.width)
        else
          MergeTable(result_tags, cycleway)
          freshTag = "check_date:" .. cycleway.prefix
        end

        result_tags.age = AgeInDays(ParseCheckDate(tags[freshTag]))

        MergeTable(result_tags, DeriveSmoothness(cycleway))
        MergeTable(result_tags, DeriveSurface(cycleway))
        CopyTags(result_tags, tags, tags_copied)
        CopyTags(result_tags, tags, tags_prefixed, 'osm_')
        -- cycleway._todos = ToMarkdownList(BikelanesTodos(cycleway))

        result_bikelanes[i] = result_tags
      end
    end
  end

  return result_bikelanes
end
