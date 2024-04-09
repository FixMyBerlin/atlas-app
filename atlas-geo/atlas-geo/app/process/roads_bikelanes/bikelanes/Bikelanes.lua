package.path = package.path .. ";/app/process/helper/?.lua"
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

  -- generate cycleways from center line tagging, also includes the original object with `side = self`
  local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence
  local transformedObjects = GetTransformedObjects(tags, transformations)

  for i, transformedTags in pairs(transformedObjects) do
    local onlyPresent = CategorizeOnlyPresent(transformedTags)
    if onlyPresent ~= nil then
      result_bikelanes[i] = { _infrastructureExists = false, category = onlyPresent, _side = transformedTags._side }
    else
      local category = CategorizeBikelane(transformedTags)
      if category ~= nil then
        local result_tags = {
          _infrastructureExists = true,
          category = category,
          offset = SideSignMap[transformedTags._side] * RoadWidth(tags) / 2,
          oneway = Sanitize(transformedTags.oneway, Set({ 'yes', 'no' })) or InferOneway(category),
          bridge = Sanitize(tags.bridge, Set({ "yes" })),
          tunnel = Sanitize(tags.tunnel, Set({ "yes" })),
        }

        if transformedTags._side == "self" then -- center line case
          result_tags.age = AgeInDays(ParseCheckDate(tags["check_date"]))
        else                        -- left/right case
          MergeTable(result_tags, transformedTags)
          result_tags._parent_highway = tags.highway
          local freshKey = "check_date:" .. transformedTags._prefix
          result_tags.age = AgeInDays(ParseCheckDate(tags[freshKey]))
        end
        -- Handle `transformedTags`
        result_tags.width = ParseLength(transformedTags.width)
        -- `oneway`: Our data should be explicit about tagging that OSM considers default/implicit as well assumed defaults.
        result_tags.todos = ToMarkdownList(BikelanesTodos(transformedTags, result_tags))
        MergeTable(result_tags, DeriveSmoothness(transformedTags))
        MergeTable(result_tags, DeriveSurface(transformedTags))

        -- copy original tags
        CopyTags(result_tags, tags, tags_copied)
        CopyTags(result_tags, tags, tags_prefixed, 'osm_')

        result_bikelanes[i] = result_tags
      end
    end
  end

  return result_bikelanes
end
