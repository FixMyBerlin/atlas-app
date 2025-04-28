CREATE OR REPLACE FUNCTION locate_on_kerb (node_id_input bigint, node_geom geometry) RETURNS TABLE (rel_position double precision, way_id bigint) AS $$
BEGIN
    -- Find the longest road that the node is part of
    RETURN QUERY
    SELECT
        ST_LineLocatePoint(parking_kerbs.geom, node_geom) AS rel_position,
        parking_kerbs.osm_id AS way_id
    FROM _node_kerb_mapping nkm
    JOIN parking_kerbs ON parking_kerbs.osm_id = nkm.way_id
    WHERE nkm.node_id = node_id_input
      AND parking_kerbs.tags->>'side' = 'right'
    ORDER BY ST_Length(parking_kerbs.geom) DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;
