CREATE OR REPLACE FUNCTION locate_on_road(
    node_id_input bigint,
    node_geom geometry
)
RETURNS double precision AS $$
DECLARE
    longest_road_geom geometry;
BEGIN
    -- Find the longest road that the node is part of
    SELECT r.geom
    INTO longest_road_geom
    FROM _node_street_mapping nsm
    JOIN roads r ON r.id = nsm.way_id
    WHERE nsm.node_id = node_id_input
    ORDER BY ST_Length(r.geom) DESC
    LIMIT 1;

    IF longest_road_geom IS NULL THEN
        RAISE EXCEPTION 'No roads found for node %', node_id_input;
    END IF;

    -- Return relative position on the longest road
    RETURN ST_LineLocatePoint(longest_road_geom, node_geom);
END;
$$ LANGUAGE plpgsql STABLE;
