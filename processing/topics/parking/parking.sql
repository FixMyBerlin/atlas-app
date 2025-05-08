/* sql-formatter-disable */
--
-- Entry point for all SQL based processing of parking data.
--
-- Guidelines:
-- - Put all decisions (that are feasable) into LUA and pass them to SQL via tags.
-- - Use "command tags" like "perform_snap".
-- - Extract complex SQL into functions.
-- - Split code into files and document them.
-- - Indexes are handled by the SQL files.
-- - TODO: Add tests for those files.
--


-- HANDLE ROADS
\i '/processing/topics/parking/roads/0_create_kerbs.sql'
\i '/processing/topics/parking/roads/1_merge_kerbs.sql'
\i '/processing/topics/parking/roads/2_define_kerb_projection.sql'
\i '/processing/topics/parking/roads/3_define_kerb_tangent.sql'
\i '/processing/topics/parking/roads/4_find_intersections.sql'
\i '/processing/topics/parking/roads/5_find_intersection_corners.sql'
\i '/processing/topics/parking/roads/6_find_driveways.sql'

-- HANDLE OBSTACLES
\i '/processing/topics/parking/obstacles/0_areas_project_to_kerb.sql'
\i '/processing/topics/parking/obstacles/0_points_project_to_kerb.sql'
\i '/processing/topics/parking/obstacles/1_points_locate_on_kerb.sql'
\i '/processing/topics/parking/obstacles/2_points_create_kerb_tangents.sql'

-- CREATE PUNCHING AREAS
\i '/processing/topics/parking/punching_areas.sql'
