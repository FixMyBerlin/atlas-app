-- ABOUT
-- Some obstacle points need to be moved before they can be snapped.
-- PROCESS
-- 1. Find the highway (kerbs) of this point based on a small buffer
-- 2. Pick the perform_move values from this kerb
-- 3. Use this value to move the node
-- WIP
-- This does not work, yet.
-- It does move things around a bit, but it does not move them orthogonal to the highway.
-- And the "distance to move" is hardcoded, of course, it should be derived from the perform_move value of the right highway on the kerb table.
-- Actually, it might be better to roll back to "punching" (stanzen) those obstacles in a separate punch step before the parking lines get moved to the left/right so we don't need to bother with moving the points correctly. For the debug view, having the points moved would be better, though…
DROP TABLE IF EXISTS parking_obstacle_points_located;
SELECT
  osm_type,
  osm_id,
  id,
  tags,
  meta,
  geom,
  minzoom,
  (locate_on_kerb(osm_id, geom)).*
INTO parking_obstacle_points_located
FROM parking_obstacle_points
WHERE tags->>'perform_snap' = 'side';

ALTER TABLE parking_obstacle_points_located
ALTER COLUMN geom TYPE geometry(Geometry, 5243)
USING ST_SetSRID(geom, 5243);
