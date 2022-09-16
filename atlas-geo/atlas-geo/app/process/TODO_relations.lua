-- Goal:
-- ======
-- We want to display bicycle and tracking (walking) routes (relations) on the map.
-- We focus on cycle relations. But other relations like walking, running, …
-- do also hint at infrastructure candidates, so we should add a few of those as well.
-- See https://wiki.openstreetmap.org/wiki/Key:route#Non-motorized_land_routes

-- Kontext:
-- ======
-- In general, "Wanderwege" and "Fahrradroute" do not neccesairy have anything to do with good infrastructure.
-- In addition, they tend to be focussed on tourism and not life and work related tours.
-- However, they are helpful as secondary information layer to hint at infrastrucuture that might be suited
-- to use or improve.

-- Notes:
-- ======
-- I am not sure, yet, about the best way to process and prepare the data.
-- Option 1: Create a separate db table with roads and relation attributes.
-- Option 2: Extend the existing tables to add relation attributes.

-- Stretch Goal:
-- ======
-- A secondary project based on the relation could be to also display guide post data from OSM.
-- Administrations could use that to be motivated to add guide posts to OSM and use OSM as a GIS for this data.
-- However, appart from that the data is not very useful since no other service uses it AFAIK.
-- Exmaple: https://www.openstreetmap.org/node/2192485170 which is part of the relation https://www.openstreetmap.org/relation/335268
-- Wiki https://wiki.openstreetmap.org/wiki/Tag:information=guidepost
