package.path = package.path .. ";/processing/topics/helper/?.lua"
require("Set")
require("TimeUtils")
require("BikelaneCategories")
require("transformations")
require("CopyTags")
require("RoadWidth")
require("DeriveSurface")
require("DeriveSmoothness")
require("BikelaneTodos")
require("Sanitize")
require("DeriveOneway")
require("DefaultId")
require("DeriveTrafficSigns")
require("CollectTodos")
require("ToMarkdownList")
require("ToTodoTags")

local tags_copied = {
  "mapillary",
  "description",
}
local tags_prefixed = {
  'surface:colour',
  'separation',
  'separation:left',
  'separation:right',
  'traffic_mode',
  'traffic_mode:left',
  'traffic_mode:right',
}
local sideSignMap = {
  ["left"] = 1,
  ["right"] = -1
}

-- transformations for nested tags:
local footwayTransformation = CenterLineTransformation.new({
  highway = "footway",
  prefix = "sidewalk",
  filter = function(tags)
    return not (tags.footway == 'no' or tags.footway == 'separate')
  end,
  direction_reference = 'parent'
})
local cyclewayTransformation = CenterLineTransformation.new({
  highway = "cycleway",
  prefix = "cycleway",
  direction_reference = 'self'
})

local transformations = { cyclewayTransformation, footwayTransformation } -- order matters for presence

function Bikelanes(object)
  local tags = object.tags
  local result_bikelanes = {}

  -- generate cycleways from center line tagging, also includes the original object with `side = self`
  local transformedObjects = GetTransformedObjects(tags, transformations)

  for _, transformedTags in ipairs(transformedObjects) do
    local category = CategorizeBikelane(transformedTags)
    if category ~= nil then
      local result_tags = {
        _side = transformedTags._side,
        _infrastructureExists = category.infrastructureExists,
        _updated_age = AgeInDays(object.timestamp), -- duplicated because we don't have access to where the data is added in road_bikelanes.lua and need it for BikelaneTodos
        category = category.id,
      }
      if category.infrastructureExists then
        MergeTable(result_tags, {
          _id = DefaultId(object),
          _infrastructureExists = true,
          -- _age = AgeInDays(ParseCheckDate(tags["check_date"])),
          prefix = transformedTags._prefix,
          width = ParseLength(transformedTags.width),
          oneway = DeriveOneway(transformedTags, category),
          bridge = Sanitize(tags.bridge, { "yes" }),
          tunnel = Sanitize(tags.tunnel, { "yes" }),
        })

        MergeTable(result_tags, DeriveTrafficSigns(transformedTags))
        MergeTable(result_tags, DeriveSmoothness(transformedTags))
        MergeTable(result_tags, DeriveSurface(transformedTags))
        CopyTags(result_tags, transformedTags, tags_prefixed, 'osm_')
        -- copy original tags
        CopyTags(result_tags, tags, tags_copied)

        -- these keys are different for projected geometries
        if transformedTags._side ~= "self" then
          result_tags._id = DefaultId(object) .. '/' .. transformedTags._prefix .. '/' .. transformedTags._side
          result_tags._parent_highway = transformedTags._parent_highway
          result_tags.offset = sideSignMap[transformedTags._side] * RoadWidth(tags) / 2
          -- result_tags._age = AgeInDays(ParseCheckDate(tags["check_date:" .. transformedTags._prefix]))
        end

        local todos = CollectTodos(BikelaneTodos, transformedTags, result_tags)
        result_tags._todo_list = ToTodoTags(todos)
        result_tags.todos = ToMarkdownList(todos)
      end
      table.insert(result_bikelanes, result_tags)
    end
  end

  return result_bikelanes
end
