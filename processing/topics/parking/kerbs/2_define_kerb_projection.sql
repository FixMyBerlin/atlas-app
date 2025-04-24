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
  rel_position_on_kerb double precision;
  substring_start double precision := 1.0;
  substring_end double precision := 0.0;
BEGIN

  -- Find the closest kerb from parking_kerbs_merged
  SELECT geom
  INTO closest_kerb
  FROM parking_kerbs_merged
  WHERE ST_DWithin(input_geom, geom, tolerance)
  ORDER BY ST_Distance(input_geom, geom)
  LIMIT 1;

  -- If no closest geometry (kerb) is found, return the input geometry
  IF closest_kerb IS NULL THEN
      RETURN input_geom;
  END IF;

  -- Apply ST_Segmentize to discretize the closest kerb geometry
  closest_kerb_quantized := ST_Segmentize(closest_kerb, quantization);


  -- Loop through each point in the input geometry using ST_DumpPoints
  FOR rec IN
    SELECT * FROM ST_DumpPoints(input_geom)
  LOOP
    -- For each point, get the relative position on the closest kerb
    point_on_kerb := ST_ClosestPoint(closest_kerb_quantized, rec.geom);
    rel_position_on_kerb :=  ST_LineLocatePoint(closest_kerb, point_on_kerb);

    -- Check if the point extends the substring
    substring_start := LEAST(substring_start, rel_position_on_kerb);
    substring_end := GREATEST(substring_end, rel_position_on_kerb);
  END LOOP;

  -- Use the relative start and end position to extract the projected substring
  RETURN ST_LineSubstring(closest_kerb, substring_start, substring_end);

END;
$$ LANGUAGE plpgsql STABLE;
