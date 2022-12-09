package.path = package.path .. ";/app/process/helper/?.lua;/app/process/shared/?.lua"
require("Set")
require("ExtractKeys")
require("FilterTags")
-- require("ToNumber")
-- require("PrintTable")
require("AddAddress")
require("MergeArray")
require("Metadata")

-- Shared:
require("ShoppingAllowedListWithCategories")

-- The goal of this TodoList is to make sure we do not miss out on any amenitys.
-- The amenity key is used for all kind of stuff.
-- For our `poiClassification` list, we only include those values
-- that are part of `ShoppingAllowedListWithCategories``
-- The goal of this TodoList is, see all values that we did not include
-- … and did not explicitly decide to skip.
local table = osm2pgsql.define_table({
  name = 'poiClassification_todoList',
  ids = { type = 'any', id_column = 'osm_id', type_column = 'osm_type' },
  columns = {
    { column = 'tags', type = 'jsonb' },
    { column = 'meta', type = 'jsonb'},
    { column = 'geom', type = 'point' },
  }
})

-- Guards extracted to be used inside projcess_*
-- @return `true` whenever we want to exit processing the given data
local function ExitProcessing(object)
  if not object.tags.amenity then
    return true
  end

  -- We skip values that are on the allow list:
  if ShoppingAllowedListWithCategories[object.tags.amenity] then
    return true
  end

  -- We skip values that we explicitly desided to ignore:
  local skip_list = Set({
    "adult_gaming_centre",
    "animal_breeding",
    "animal_shelter",
    "archive",
    "ash_tray",
    "atm",
    "baby_hatch",
    "baking_oven",
    "bench",
    "bicycle_parking",
    "bicycle_repair_station",
    "binoculars",
    "brothel",
    "bus_station",
    "car_sharing",
    "charging_station",
    "clock",
    "compressed_air",
    "construction",
    "coworking_space",
    "crematorium",
    "dressing_room",
    "drinking_water",
    "DRK",
    "feeding_place",
    "ferry_terminal",
    "fire_station",
    "first_aid",
    "Fischzuchtanlage",
    "fountain",
    "funeral_hall",
    "give_box",
    "grave_yard",
    "grit_bin",
    "hookah_lounge",
    "hunting_stand",
    "kitchen",
    "kneipp_water_cure",
    "lamp",
    "letter_box",
    "loading_dock",
    "lounger",
    "luggage_locker",
    "mobile_library",
    "motorcycle_parking",
    "nest_box",
    "nursing_home",
    "parcel_locker",
    "parish_hall",
    "parking_entrance",
    "parking_space",
    "parking",
    "photo_booth",
    "planetarium",
    "police",
    "post_box",
    "proposed",
    "public_bookcase",
    "pushchair_parking",
    "reception_desk",
    "recycling",
    "sanitary_dump_station",
    "shelter",
    "shower",
    "smoking_area",
    "stripclub",
    "studio",
    "swingerclub",
    "table",
    "taxi",
    "telephone",
    "ticket_validator",
    "toilets",
    "trolley_bay",
    "vacuum_cleaner",
    "vending_any",
    "vending_cigarette",
    "vending_machine;waste_basket",
    "vending_machine",
    "washing_machine",
    "waste_basket;vending_machine",
    "waste_basket",
    "waste_disposal",
    "waste_transfer_station",
    "water_point",
    "water",
    "watering_place",
    "workshop",
    "yes"
  })
  if skip_list[object.tags.amenity] then
    return true
  end

  return false
end

-- Tag processing extracted to be used inside projcess_*
local function processTags(tags)
  local allowed_addr_tags = AddAddress(tags)
  local allowed_tags = Set(MergeArray({ "name", "category", "type", "amenity" }, allowed_addr_tags))
  FilterTags(tags, allowed_tags)
  tags.taginfo_url = "https://taginfo.openstreetmap.org/tags/amenity=" .. tags.amenity
end

function osm2pgsql.process_node(object)
  if ExitProcessing(object) then return end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_point()
  })
end

function osm2pgsql.process_way(object)
  if ExitProcessing(object) or not object.is_closed then
    return
  end

  processTags(object.tags)

  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_polygon():centroid()
  })
end

function osm2pgsql.process_relation(object)
  if ExitProcessing(object) then return end
  if not object.tags.type == 'multipolygon' then return end

  processTags(object.tags)
  table:insert({
    tags = object.tags,
    meta = Metadata(object),
    geom = object:as_multipolygon():centroid()
  })
end
