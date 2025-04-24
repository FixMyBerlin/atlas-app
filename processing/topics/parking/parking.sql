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

-- HANDLE OBSTACLES
--
\i '/processing/topics/parking/obstacles/points_1_perform_move.sql'

-- HANDLE ROADS

-- HANDLE KERBS

-- HANDLE PARKING LINES
--
\i '/processing/topics/parking/parking/1_perform_move.sql'
\i '/processing/topics/parking/parking/2_reverse_direction.sql'
