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
  local centerlineTags = object.tags
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
  local transformedObjects = GetTransformedObjects(centerlineTags, transformations)

  for i, cyclewayTags in pairs(transformedObjects) do
    local sign = cyclewayTags.sign
    local onlyPresent = CategorizeOnlyPresent(cyclewayTags)
    if onlyPresent ~= nil then
      result_bikelanes[i] = { _infrastructureExists = false, category = onlyPresent, sign = sign }
    else
      local category = CategorizeBikelane(cyclewayTags)
      if category ~= nil then
        local result_tags = {
          _infrastructureExists = true,
          category = category,
          offset = sign * RoadWidth(centerlineTags) / 2, -- TODO: Should be `_offset`
          sign = sign,
        }

        -- All our tag processing is done on either the transformed tags or the centerline tags
        local workingTags = cyclewayTags
        if sign == CENTER_SIGN then -- center line case
          workingTags = centerlineTags
        else                        -- left/right case
          MergeTable(result_tags, cyclewayTags)
        end

        -- Handle `workingTags`
        result_tags.width = ParseLength(workingTags.width)
        result_tags.bridge = Sanitize(workingTags.bridge, Set({ "yes" }))
        result_tags.tunnel = Sanitize(workingTags.tunnel, Set({ "yes" }))
        -- `oneway`: Our data should be explicit about tagging that OSM considers default/implicit as well assumed defaults.
        result_tags.oneway = Sanitize(workingTags.oneway, Set({ 'yes', 'no' })) or InferOneway(category)
        result_tags.todos = ToMarkdownList(BikelanesTodos(workingTags, result_tags))
        MergeTable(result_tags, DeriveSmoothness(workingTags))
        MergeTable(result_tags, DeriveSurface(workingTags))

        -- Handle `centerlineTags`
        if sign == CENTER_SIGN then
          result_tags.age = AgeInDays(ParseCheckDate(centerlineTags["check_date"]))
        else
          local freshKey = "check_date:" .. cyclewayTags.prefix
          result_tags.age = AgeInDays(ParseCheckDate(centerlineTags[freshKey]))
        end
        CopyTags(result_tags, centerlineTags, tags_copied)
        CopyTags(result_tags, centerlineTags, tags_prefixed, 'osm_')

        result_bikelanes[i] = result_tags
      end
    end
  end

  return result_bikelanes
end
