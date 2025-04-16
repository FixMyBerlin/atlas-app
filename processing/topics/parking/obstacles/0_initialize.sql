-- ABOUT
-- Copy data
-- NOTE: The table is initialized by osm2pgsql in parking.lua but nothing is added.

INSERT INTO public.parking_obstacle_points
SELECT * FROM public.parking_source_obstacle_points;

INSERT INTO public.parking_obstacle_areas
SELECT * FROM public.parking_source_obstacle_areas;
