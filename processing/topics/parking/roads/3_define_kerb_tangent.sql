CREATE OR REPLACE FUNCTION line_azimuth_at_index (geom geometry, idx integer, direction integer) RETURNS double precision AS $$
DECLARE
  npoints integer := ST_NPoints(geom);
  pt1 geometry;
  pt2 geometry;
BEGIN
  IF geom IS NULL OR GeometryType(geom) != 'LINESTRING' THEN
    RAISE EXCEPTION 'Input must be a LINESTRING';
  END IF;

  IF idx < 1 OR idx > npoints THEN
    RAISE EXCEPTION 'Index out of bounds: % (line has % points)', idx, npoints;
  END IF;

  IF direction = 1 THEN
    IF idx < npoints THEN
      pt1 := ST_PointN(geom, idx);
      pt2 := ST_PointN(geom, idx + 1);
    ELSE
      pt1 := ST_PointN(geom, idx - 1);
      pt2 := ST_PointN(geom, idx);
    END IF;
  ELSIF direction = -1 THEN
    IF idx > 1 THEN
      pt1 := ST_PointN(geom, idx - 1);
      pt2 := ST_PointN(geom, idx);
    ELSE
      pt1 := ST_PointN(geom, idx);
      pt2 := ST_PointN(geom, idx + 1);
    END IF;
  ELSE
    RAISE EXCEPTION 'Direction must be "1" or "-1", got: %', direction;
  END IF;

  RETURN ST_Azimuth(pt1, pt2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

--
CREATE OR REPLACE FUNCTION kerb_tangent (
  road_id BIGINT,
  idx INTEGER,
  side TEXT,
  direction INTEGER,
  length INTEGER
) RETURNS geometry AS $$
DECLARE
  road_geom geometry;
  kerb_geom geometry;
  point_geom geometry;
  azimuth double precision;
BEGIN

  SELECT geom INTO road_geom FROM _parking_roads WHERE osm_id = road_id;
  SELECT geom INTO kerb_geom FROM parking_kerbs WHERE osm_id = road_id AND parking_kerbs.side = kerb_tangent.side;
  point_geom := ST_ClosestPoint(kerb_geom, ST_PointN(road_geom, idx));

  IF side = 'right' THEN
    azimuth := line_azimuth_at_index(road_geom, idx, direction);
  ELSIF side = 'left' THEN
    azimuth := line_azimuth_at_index(road_geom, idx, -direction);
  ELSE
    RAISE EXCEPTION '"side" must be "left" or "right", got: %', direction;
  END IF;
  RETURN ST_MakeLine(point_geom, ST_Project(point_geom, length, azimuth));
END;
$$ LANGUAGE plpgsql STABLE;
