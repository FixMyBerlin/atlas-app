-- this function projects a given geometry to the closest kerb resulting in a linestring
-- the parameter tolerance define the maximum distance to the closest kerb
-- the parameter quantization controls the maximal distance between two points on the kerb
-- a small quantization results in a better approximation of the projection while increasing computational cost
CREATE OR REPLACE FUNCTION project_to_closest_kerb(
  input_geom geometry,
  tolerance double precision,
  quantization double precision
)
RETURNS geometry AS $$
DECLARE
  closest_kerb geometry;
  closest_kerb_quantized geometry;
  point_on_kerb geometry;
  rec RECORD;
BEGIN
  -- Step 1: Find the closest kerb from parking_kerbs_merged
  SELECT geom
  INTO closest_kerb
  FROM parking_kerbs_merged
  WHERE ST_DWithin(input_geom, geom, tolerance)
  ORDER BY ST_Distance(input_geom, geom)
  LIMIT 1;

  IF closest_kerb IS NOT NULL THEN
    -- Step 2: Apply ST_Segmentize to discretize the closest kerb geometry
    closest_kerb_quantized := ST_Segmentize(closest_kerb, quantization);

	DROP TABLE IF EXISTS temp_points;
    -- Step 3: Create a temporary table to store the points and their relative position on the kerb
    CREATE TEMP TABLE temp_points (
      point_geom geometry,
      rel_position double precision
    );

    -- Step 4: Loop through each point in the input geometry using ST_DumpPoints
    FOR rec IN
      SELECT * FROM ST_DumpPoints(input_geom)  -- Get all points in the input geometry
    LOOP
      -- Step 5: For each point, find the closest point on the quantized kerb geometry
      point_on_kerb := ST_ClosestPoint(closest_kerb_quantized, rec.geom);

      -- Step 6: Get the relative position of the point on the quantized kerb geometry
      INSERT INTO temp_points (point_geom, rel_position)
      VALUES (
        point_on_kerb,
        ST_LineLocatePoint(closest_kerb, point_on_kerb)
      );
    END LOOP;

    -- Step 7: Use the relative position to sort the points and create the LineString
    RETURN ST_MakeLine(point_geom ORDER BY rel_position) FROM temp_points;
	DROP TABLE temp_points;
  ELSE
    -- If no closest geometry (kerb) is found, return the input geometry
    RETURN input_geom;
  END IF;
END;
$$ LANGUAGE plpgsql VOLATILE;
