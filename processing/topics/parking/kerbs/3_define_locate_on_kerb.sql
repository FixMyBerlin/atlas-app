CREATE OR REPLACE FUNCTION locate_on_kerb(
    node_id_input bigint,
    node_geom geometry
)
RETURNS double precision AS $$
DECLARE
    longest_kerb geometry;
BEGIN
    -- Find the longest road that the node is part of
    SELECT parking_kerbs.geom
    INTO longest_kerb
    FROM _node_kerb_mapping nkm
    JOIN parking_kerbs parking_kerbs ON parking_kerbs.osm_id = nkm.way_id
    WHERE nkm.node_id = node_id_input
    ORDER BY ST_Length(parking_kerbs.geom) DESC
    LIMIT 1;

    IF longest_kerb IS NULL THEN
        RAISE EXCEPTION 'No roads found for node %', node_id_input;
    END IF;

    -- Return relative position on the longest road
    RETURN ST_LineLocatePoint(longest_kerb, node_geom);
END;
$$ LANGUAGE plpgsql STABLE;
