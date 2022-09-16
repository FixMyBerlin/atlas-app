-- Goal:
-- =========
-- All bike related roads should have an explicit traffic_sign tag.
-- In OSM traffic_signs are usually not mapped but their consequence is.
-- For example, a "Gehweg mit Radwegfreigabe" is "highway=footway + bicycle=yes".
-- That is fine for routers; but we want to know in detail if this tagging is based
-- on a traffic_sign or based on interpretation, local knowlege ("that is how it is used")
-- and so on.


-- Table:
-- =========
-- Include all bike related roads that do _not_ have a traffic_sign.
-- Explain in a "_todos" field which traffic_sign we would expect.


-- Gotchas:
-- =========
-- Traffic signs are a text field, using the format "DE:<SignId>;<SignId>;<SignId>"
-- where the order of comma separated values should follow the order of sign (top to bottom).
-- Our quersies need to take into account that a Zusatzzeichen could be anywhere in this string.
-- We probably need a new helper similar to the "StartsWith" helper.

-- How to explicitly tag that no traffic_sign exist:
-- `traffic_sign=none` would be the excape hatch to remove the warning/_todos-Entry.


-- Ressources:
-- =========
-- https://wiki.openstreetmap.org/wiki/DE:Bicycle/Radverkehrsanlagen_kartieren#Eigenst%C3%A4ndige_Wege
-- http://osmtools.de/traffic_signs/


-- Most importantly:
-- =========
-- * "Radweg"
-- object.tags._todos = "Missing `traffic_sign`; maybe `traffic_sign=DE:237`"
-- Look for:
--    highway = cycleway
--    bicycle = designated
--
-- Unfortunatelly, OSM tagging is more complex that that.
-- The tagging above is relevant whenever the cycleway was mapped as a separate geometry.
-- But the data could also be part of the centerline (one line to hold tags for all traffic modes).
-- In this case, the data we need would be tagged with prefixes like below.
-- The "_todos" recommendation should also change accordingly (or we generalise it)
-- Note that the ":right" part could also be ":left" depending on the direction of the road and the placement of the cycleway.
-- Look for:
--    cycleway:right=track | lane
--    cycleway:right:bicycle=designated
--    cycleway:right:segregated=yes
--    cycleway:right:traffic_sign=DE:237


-- * "Gemeinsamer Geh- und Radweg"
-- * or "Gemeinsamer Geh- und Radweg, Anlieger frei"
-- * or "Gemeinsamer Geh- und Radweg, Landwirtschaftlicher Verkehr frei"
-- object.tags._todos = "Missing `traffic_sign`; likely `traffic_sign=DE:240`"
-- Look for:
--    highway = path | cycleway
--    bicycle = designated
--    foot = designated
--    segregated = no
-- Look for:
--    cycleway:right=track
--    cycleway:right:bicycle=designated
--    cycleway:right:segregated=no
--    cycleway:right:traffic_sign=DE:240
-- This might also be "path:right", but this is very uncommon https://taginfo.openstreetmap.org/search?q=path%3Aright.


-- * "Getrennter Rad- und Gehweg" | "Getrennter Geh- und Ragweg"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241
-- object.tags._todos = "Missing `traffic_sign`; likely `traffic_sign=DE:241-30` or `241-31`"
-- Note: Just "241" could be a different todo to add the explcit side as well.
-- Look for:
--    highway = path | cycleway
--    bicycle = designated
--    foot = designated
--    segregated = yes
-- Look for:
--    cycleway:right=track
--    cycleway:right:bicycle=designated
--    cycleway:right:segregated=yes
--    cycleway:right:traffic_sign=DE:241


-- * "Gehweg, Radfahrer frei"
-- https://wiki.openstreetmap.org/wiki/DE:Tag:traffic_sign%3DDE:241
-- object.tags._todos = "Missing `traffic_sign`; likely `traffic_sign=DE:239,1022-10`"
-- Look for:
--    highway = footway
--    foot = designated
--    bicycle = yes
-- Look for:
--    sidewalk:right:bicycle=yes
--    sidewalk:right:traffic_sign=DE:239,1022-10


-- * Just the "Radfahrer frei"-Sign – From the list at https://wiki.openstreetmap.org/wiki/DE:Bicycle/Radverkehrsanlagen_kartieren#Eigenst%C3%A4ndige_Wege
-- I don't see a good way to add todos for this and don't see much value.
-- I consider this kind of signs a bug in infrastructure anyways, so they should be improved…


-- * "Fahrradstraße"
-- Typical additional signs https://wiki.openstreetmap.org/wiki/DE:Key:bicycle_road#Zusatzzeichen
-- object.tags._todos = "Missing `traffic_sign`; likely `traffic_sign=DE:244.1` with additional signs"
-- Look for:
--    highway=* (entsprechend dem Ausbauzustand bzw. der Verkehrsbedeutung)
--    bicycle_road=yes

-- * Additinal checks/_todos for "Fahrradstraße"
-- 1. "Access"
-- Based on the Zusatzzeichen, check for and add a "_todos" entry to explicitly add a standard access tag.
-- Example: "traffic_sign=DE:244.1;1020-30" needs "vehicle=destination"
-- 2. "maxspeed"
-- Base on "bicycle_road=yes", check if "maxspeed=*" is present. And if "maxspeed=30", also if "source:maxspeed=DE:bicycle_road" is present. If not, add a "_todos" note to add them.

-- * "Fahrradzone"
-- See https://wiki.openstreetmap.org/wiki/DE:Key:bicycle_road#Fahrradzonen
-- This needs some more research. I think the tagging in OSM is not yet matured.
-- The linked example does create an area for the Fahrradzone, which I do not like.
-- The tagging should be on the road, which it is not (or just indirectly via maxspeed:source)
-- I think, we can and should skip this traffic_sign until a better tagging became standard.
-- Which should be OK, since no one uses this traffic_sign, yet AFAIK.


-- Inverse checks:
-- =========
-- We should also consider checking the inverse:
-- Whenever a traffic_sign=<OneOfTheValuesAbove> is present, the road segment _should_ follow
-- the recommended tags based on the Wiki.
-- HOWEVER, that is not always true, so we need an excape hatch for those checks AKA a OSM-compatible
-- way to tell the script that this non-recommended-taggging is in fact correct.
-- Exampe:
--    A road "Getrennter Rad- und Gehweg" is tagged with `traffic_sign=DE:241-30 + segregated=yes` (correct).
--    One segment of this road is on a sidewalk that becomes too narrow for the paint on the sidewalk to be of any meaning,
--    for example due to an old house that reaches into the sidewalk.
--    For that segment, an OSM user might decide to tag "segregated=no" since "on the ground" there is no segregation anymore.
--    But, the traffic_sign did not change for this 20m segment, just the road configuration did.
--    This might be considered a Bug in how the cycleway is signed by officials, however I would not want an official to waste
--    additional signs for those 20m. In a sence both are correct, the cycleway as a whole is "Getrennter Rad- und Gehweg"
--    with a small exception somewhere along the way.
--    Our excape hatch in this case could be `check_date:segregated=<Date>`. Once this is present, we consider this
--    situation re-validated and skip the check. Our docs would explain: Either fix the tagging, or add the specific check_date-Tag
--    to get rid of the warning/todo.


-- Further checks:
-- =========
-- * Check for https://wiki.openstreetmap.org/wiki/Key:cyclestreet
-- This tagging should not be used in DE, but it tells a very similar story like bicycle_road=yes.
-- We should add a _todos "Unexpected tagging `cyclestreet`. Check to retag as `bicycle_road`".
-- Stretch Goal 1: This check should _not_ appear once the tag `check_date:cyclestreet=<SomeDate>` is present.
-- Stretch Goal 2: The check for "check_date:cycleway=2022-01-01" only skip the _todos when the Date > "1,5 years ago".
