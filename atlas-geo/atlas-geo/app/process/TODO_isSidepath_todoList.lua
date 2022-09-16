-- Goal:
-- ======
-- We rely on a new tagging for our processing called "is_sidepath"
-- Wiki: https://wiki.openstreetmap.org/wiki/Proposed_features/Key:is_sidepath
--    We will update this page in the next few weeks.
-- We need a todoList to add this tagging where missing.

-- The tagging should be applied for all separately mapped foot- and cycle-ways
-- that are part of the "road system" of a given road.
-- We use it, to easily filter separately mapped geometries in cases
-- where we only need the centerline, eg the "Straßentypen".

-- Check:
-- * highway=footway + footway=sidewalk
-- We can skip this, since the "sidewalk" implicitly says "is_sidepath=yes"

-- * highway=footway (no sidewalk)
-- _todos: Add "footway=sidewalk" (implicit is_sidepath=yes)
--    OR add "is_sidepath=no" if not parallel to a road.

-- * highway=cycleway | path
-- _todos: Add "is_sidepath=yes|no" if next to a raod (yes) or a stand alone path eg. between fields (no)
