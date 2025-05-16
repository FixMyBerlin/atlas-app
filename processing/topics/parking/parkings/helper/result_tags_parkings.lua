package.path = package.path .. ";/processing/topics/helper/?.lua"
package.path = package.path .. ";/processing/topics/roads_bikelanes/roads/?.lua"
package.path = package.path .. ";/processing/topics/parking/helper/?.lua"
package.path = package.path .. ";/processing/topics/parking/roads/helper/?.lua"
require("CopyTags")
require("MergeTable")
require("DefaultId")
require("Metadata")
require("ParseLength")
require("RoadClassificationRoadValue")
require("road_name")
require("Log")
require("road_width")
require("ParseLength")
require("Sanitize")
require("this_or_that")

-- EXAMPLE
-- INPUT
-- ["parking:left"] = "no",
-- ["parking:left:restriction"] = "no_stopping",
-- ["parking:right"] = "lane",
-- ["parking:right:fee"] = "no",
-- ["parking:right:markings"] = "yes",
-- ["parking:right:orientation"] = "parallel",
-- ["parking:right:restriction:conditional"] = "loading_only @ (Mo-Fr 08:00-18:00)",
--
-- LEFT
-- parent_highway = "residential",
-- parking = "no",
-- restriction = "no_stopping",
-- side = "left"
--
-- RIGHT
-- fee = "no",
-- markings = "yes",
-- orientation = "parallel",
-- parent_highway = "residential",
-- parking = "lane",
-- ["restriction:conditional"] = "loading_only @ (Mo-Fr 08:00-18:00)",
-- side = "right"



function result_tags_parkings(object)
  local id = DefaultId(object) .. "/" .. object._side

  local allowed_reasons = {
    "bus_lane", "rails", "bus_stop", "crossing", "cycleway", "driveway", "dual_carriage", "fire_lane", "junction", "loading_zone", "markings", "narrow", "passenger_loading_zone", "priority_road", "street_cleaning", "turnaround", "turn_lane"
  }

  local allowed_access = {"yes", "no", "private", "customers", "delivery", "permissive", "residents", "designated", "unknown"}

  local result_tags = {}
  MergeTable(result_tags, object.tags) -- tags specified in transform_parkings()

  local specific_tags = {
    -- ROAD
    name = road_name(object.tags),
    road_width = road_width(object.tags),
    road = RoadClassificationRoadValue(object._parent_tags),
    -- PARKING
    parking = Sanitize(object.tags.parking, {"no", "yes", "lane", "street_side", "on_kerb", "half_on_kerb", "shoulder", "separate"}),
    orientation = Sanitize(object.tags.orientation, {"parallel", "diagonal", "perpendicular"}),
    capacity = ParseLength(object.tags.capacity),
    markings = Sanitize(object.tags.markings, {"yes", "no"}),
    direction = Sanitize(object.tags.direction, {"back_in", "head_in"}),
    reason = Sanitize(object.tags.reason, allowed_reasons),
    staggered = Sanitize(object.tags.staggered, {"yes", "no"}),
    restriction = Sanitize(object.tags.restriction, {"no_parking", "no_stopping", "no_standing", "loading_only", "charging_only", "none"}),
    ["restriction:conditional"] = object.tags["restriction:conditional"],
    ["restriction:bus"] = object.tags["restriction:bus"],
    ["restriction:hgv"] = object.tags["restriction:hgv"],
    ["restriction:reason"] = Sanitize(object.tags["restriction:reason"], allowed_reasons),
    ["restriction:reason:conditional"] = object.tags["restriction:reason:conditional"],
    fee = Sanitize(object.tags.fee, {"yes", "no"}),
    ["fee:conditional"] = object.tags["fee:conditional"],
    charge = object.tags.charge,
    ["charge:conditional"] = object.tags["charge:conditional"],
    maxstay = object.tags.maxstay,
    ["maxstay:conditional"] = object.tags["maxstay:conditional"],
    ["maxstay:motorhome"] = object.tags["maxstay:motorhome"],
    -- ZONE
    zone = object.tags.zone,
    ["authentication:disc"] = Sanitize(object.tags["authentication:disc"], {"yes", "no"}),
    ["authentication:disc:conditional"] = object.tags["authentication:disc:conditional"],
    -- ACCESS
    access = Sanitize(object.tags.access, allowed_access),
    ["access:conditional"] = object.tags["access:conditional"],
    private = object.tags.private,
    ["private:conditional"] = object.tags["private:conditional"],
    disabled = Sanitize(object.tags.disabled, allowed_access),
    ["disabled:conditional"] = object.tags["disabled:conditional"],
    taxi = Sanitize(object.tags.taxi, allowed_access),
    ["taxi:conditional"] = object.tags["taxi:conditional"],
    motorcar = Sanitize(object.tags.motorcar, allowed_access),
    ["motorcar:conditional"] = object.tags["motorcar:conditional"],
    hgv = Sanitize(object.tags.hgv, allowed_access),
    ["hgv:conditional"] = object.tags["hgv:conditional"],
  }
  MergeTable(result_tags, specific_tags)

  local result_tags_surface = this_or_that("surface", { value = object.tags.surface, confidence = "high", source = "tag" }, { value = object._parent_tags.surface, confidence = "medium", source = "parent_highway" })
  MergeTable(result_tags, result_tags_surface)

  local tags_cc = {
    "mapillary",
    "panoramax",
    "panoramax:0",
    "panoramax:1",
    "panoramax:2",
    "panoramax:3",
  }
  CopyTags(result_tags, object._parent_tags, tags_cc, "osm_")
  CopyTags(result_tags, object.tags, tags_cc, "osm_")

  local result_meta = Metadata(object)
  result_meta.updated_age = nil -- Lets start without this because it adds work and might not be needed

  return {
    id = id,
    side = object._side,
    tags = result_tags,
    meta = result_meta,
  }
end
