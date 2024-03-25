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
  local tagsCenterline = object.tags
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
  local transformedObjects = GetTransformedObjects(tagsCenterline, transformations)

  for i, tagsCycleway in pairs(transformedObjects) do
    local sign = tagsCycleway.sign
    local onlyPresent = CategorizeOnlyPresent(tagsCycleway)
    if onlyPresent ~= nil then
      result_bikelanes[i] = { _infrastructureExists = false, category = onlyPresent, sign = sign }
    else
      local category = CategorizeBikelane(tagsCycleway)
      if category ~= nil then
        local result_tags = {
          _infrastructureExists = true,
          category = category,
          offset = sign * RoadWidth(tagsCenterline) / 2, -- TODO: Should be `_offset`
        }

        -- All our tag processing is done on either the transformed tags or the centerline tags
        local workingTags = tagsCycleway
        if sign == CENTER_SIGN then
          workingTags = tagsCenterline
        end

        -- === Processing on the transformed dataset ===
        local freshTag = "check_date"
        if sign == CENTER_SIGN then
          result_tags.sign = CENTER_SIGN
        else
          MergeTable(result_tags, tagsCycleway)
          freshTag = "check_date:" .. tagsCycleway.prefix
        end

        -- Handle `workingTags`
        result_tags.width = ParseLength(workingTags.width)
        result_tags.bridge = Sanitize(workingTags.bridge, Set({ "yes" }))
        result_tags.tunnel = Sanitize(workingTags.tunnel, Set({ "yes" }))
        -- `oneway`: Our data should be explicit about tagging that OSM considers default/implicit as well assumed defaults.
        result_tags.oneway = Sanitize(workingTags.oneway, Set({ 'yes', 'no' })) or InferOneway(category)
        MergeTable(result_tags, DeriveSmoothness(workingTags))
        MergeTable(result_tags, DeriveSurface(workingTags))

        -- Handle `tagsCenterline`
        result_tags.age = AgeInDays(ParseCheckDate(tagsCenterline[freshTag]))
        CopyTags(result_tags, tagsCenterline, tags_copied)
        CopyTags(result_tags, tagsCenterline, tags_prefixed, 'osm_')

        result_tags.todos = ToMarkdownList(BikelanesTodos(tagsCycleway, result_tags))

        result_bikelanes[i] = result_tags
      end
    end
  end

  return result_bikelanes
end
