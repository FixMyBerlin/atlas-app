package.path = package.path .. ";/processing/topics/helper/?.lua"
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
require("DeriveOneway")
require("DefaultId")

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
local sideSignMap = {
  ["left"] = 1,
  ["right"] = -1,
  ["self"] = 0
}

-- transformations for nested tags:
local footwayTransformation = {
  highway = "footway",
  prefix = "sidewalk",
  filter = function(tags)
    return not (tags.footway == 'no' or tags.footway == 'separate')
  end
}
local cyclewayTransformation = {
  highway = "cycleway",
  prefix = "cycleway",
}

local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence

function Bikelanes(object)
  local tags = object.tags
  local result_bikelanes = {}

  -- generate cycleways from center line tagging, also includes the original object with `side = self`
  local transformedObjects = GetTransformedObjects(tags, transformations)

  for _, transformedTags in ipairs(transformedObjects) do
    local onlyPresent = CategorizeOnlyPresent(transformedTags)
    if onlyPresent ~= nil then
      local result_tag = {
        _infrastructureExists = false,
        _side = transformedTags._side,
        category = onlyPresent,
      }
      table.insert(result_bikelanes, result_tag)
    else
      local category = CategorizeBikelane(transformedTags)
      if category ~= nil then
        local result_tags = {
          _id = DefaultId(object),
          _infrastructureExists = true,
          _side = transformedTags._side,
          age = AgeInDays(ParseCheckDate(tags["check_date"])),
          prefix = transformedTags._prefix,
          category = category,
          offset = sideSignMap[transformedTags._side] * RoadWidth(tags) / 2,
          oneway = DeriveOneway(transformedTags, category),
          bridge = Sanitize(tags.bridge, { "yes" }),
          tunnel = Sanitize(tags.tunnel, { "yes" }),
        }

         -- for projected geometries we use a different `id` and `check_date` key
        if transformedTags._side ~= "self" then
          result_tags._id = DefaultId(object) .. '/' .. transformedTags._prefix .. '/' .. transformedTags._side
          result_tags._parent_highway = transformedTags._parent_highway
          result_tags.age = AgeInDays(ParseCheckDate(tags["check_date:" .. transformedTags._prefix]))
        end

        result_tags.width = ParseLength(transformedTags.width)
        result_tags.todos = ToMarkdownList(BikelanesTodos(transformedTags, result_tags))
        MergeTable(result_tags, DeriveSmoothness(transformedTags))
        MergeTable(result_tags, DeriveSurface(transformedTags))
        CopyTags(result_tags, transformedTags, tags_prefixed, 'osm_')

        -- copy original tags
        CopyTags(result_tags, tags, tags_copied)

        table.insert(result_bikelanes, result_tags)
      end
    end
  end

  return result_bikelanes
end
