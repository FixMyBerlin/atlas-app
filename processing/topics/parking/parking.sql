/* sql-formatter-disable */
--
-- Entry point for all SQL based processing of parking data.
--
-- Guidelines:
-- - Put all decisions (that are feasable) into LUA and pass them to SQL via tags.
-- - Use "command tags" like "perform_snap".
-- - Extract complex SQL into functions.
-- - Split code into files and document them.
-- - TODO: Add tests for those files.
--

-- HANDLE KERBS

\i '/processing/topics/parking/kerbs/0_perform_move.sql'
\i '/processing/topics/parking/kerbs/1_merge_kerbs.sql'
\i '/processing/topics/parking/kerbs/2_define_kerb_projection.sql'

-- HANDLE OBSTACLES
--
\i '/processing/topics/parking/obstacles/points_1_perform_move.sql'
\i '/processing/topics/parking/obstacles/0_areas_project_to_kerb.sql'


-- HANDLE ROADS


-- HANDLE PARKING LINES
--
\i '/processing/topics/parking/parking/0_perform_move.sql'
\i '/processing/topics/parking/parking/1_reverse_direction.sql'
