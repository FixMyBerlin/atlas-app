-- ABOUT
-- Copy data
-- NOTE: The table is initialized by osm2pgsql in parking.lua but nothing is added.

INSERT INTO public.parking_parking_lines
SELECT * FROM public.parking_source_parking_lines;
