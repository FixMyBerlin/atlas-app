-- Goal
-- =====
-- 1. Show all ways lit/non-lit (lit=yes|no|(?))
-- 2. Show all ways lit/non-lit AND check_date:lit > (vor 2 Jahren)

-- Wiki
-- ====
-- https://wiki.openstreetmap.org/wiki/Key:lit
--  Note: the QA tools on https://wiki.openstreetmap.org/wiki/DE:Key:lit do not work for our use case or not at all.

-- Notes
-- =====
-- Which highways do we look at?
--  We should include sidewalks.
--  But ideally, we would exclude ways that are not network-relevant like cemetary footways

-- We ignore street lamps:
--  https://wiki.openstreetmap.org/wiki/Tag:highway%3Dstreet_lamp is not relevant for this data set

-- Date transformation:
--  We take the check_date:lit=VALUE, convert it to time
--    Fallback if date missing: <15> for the middle of the month.
--  We create a custom data <Year-2>/<ThisMonth>/<01> and convert it to time
--  We compare the two and write our own "checked_withing_two_years=true|false"
--  See also https://stackoverflow.com/a/5904469/729221 about converting the values

-- Values other than yes/no:
--  We could add a _todos for those, except if there is a check_date. In those cases, we can say "someone checked and said it's OK.
--    To visualize those values, we should have a `lit_category=yes|no|special`

-- Software Test:
--  We should have some software tests for this…
--  I did a first test with '/helper/AddUrl.test.lua', wich I can run after `brew install lua` with `lua app/process/helper/AddUrl.test.lua`
--    Note, that the path where we start this will likely be important for the import-path. Those package.path are way to complicated in LUA.
