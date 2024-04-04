-- compute the orientation based on adjacent nodes
CREATE temp TABLE orientations AS
SELECT
  avg(degrees(ST_Azimuth(st_pointn(geom, idx), st_pointn(geom, idx + 1)))) AS orientation,
  count(DISTINCT osm_id) AS ways_aggregated,
  node_id
FROM
  "_trafficSignDirections"
GROUP BY
  node_id;

-- update the traffic signs for which we could compute an orientation from the query above taking the `offset` into account
UPDATE
  "trafficSigns"
SET
  tags =(tags || jsonb_build_object('direction', orientations.orientation +(tags ->>
    'offset')::integer, 'direction_source', 'way_orientation'))
FROM
  orientations
WHERE
  "trafficSigns".osm_id = "orientations".node_id
  AND "orientations".ways_aggregated <= 2;

-- format the direction s.t. it always lays between 0 an 360
UPDATE
  "trafficSigns"
SET
  tags = jsonb_set(tags, '{direction}', to_jsonb(((tags ->> 'direction')::numeric + 360) % 360))
WHERE
  tags ? 'direction';

-- inverse the sign off all traffic signs which have offset=180 to avoid ambiguities
UPDATE
  "trafficSigns"
SET
  osm_id = osm_id * -1
WHERE
  tags ->> 'offset' = '180';

-- remove `offset` from tags
UPDATE
  "trafficSigns"
SET
  tags = tags - 'offset';

-- remove direction table
DROP TABLE "_trafficSignDirections";
