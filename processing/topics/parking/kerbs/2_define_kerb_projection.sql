-- this function projects a given geometry to the closest kerb resulting in a linestring
-- the parameter tolerance define the maximum distance to the closest kerb
-- the parameter quantization controls the maximal distance between two points on the kerb
-- a small quantization results in a better approximation of the projection while increasing computational cost

-- TODO: we probably need to project to the k nearest kerbs see: https://tiles-inspector.netlify.app/#20.03/52.50324/13.3912685

CREATE OR REPLACE FUNCTION project_to_line(
  input_geom geometry,
  line geometry,
  quantization double precision
)
RETURNS geometry AS $$
DECLARE
  quantized_line geometry := ST_Segmentize(line, quantization);
  rec RECORD;
  point_on_line geometry;
  rel_position double precision;
  substring_start double precision := 1.0;
  substring_end double precision := 0.0;
BEGIN
  FOR rec IN SELECT * FROM ST_DumpPoints(input_geom)
  LOOP
    point_on_line := ST_ClosestPoint(quantized_line, rec.geom);
    rel_position := ST_LineLocatePoint(line, point_on_line);
    substring_start := LEAST(substring_start, rel_position);
    substring_end := GREATEST(substring_end, rel_position);
  END LOOP;

  RETURN ST_LineSubstring(line, substring_start, substring_end);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION project_to_k_closest_kerbs(
  input_geom geometry,
  tolerance double precision,
  quantization double precision,
  k integer
)
RETURNS geometry AS $$
DECLARE
  kerb geometry;
  projected geometry;
  result geometry := NULL;
BEGIN
  FOR kerb IN
    SELECT geom
    FROM parking_kerbs_merged
    WHERE ST_DWithin(input_geom, geom, tolerance)
    ORDER BY ST_Distance(input_geom, geom)
    LIMIT k
  LOOP
    projected := project_to_line(input_geom, kerb, quantization);
    result := ST_Collect(result, projected);
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
