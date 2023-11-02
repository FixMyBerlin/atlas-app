-- compute the orientation based on adjacent nodes
create temp table orientations as select avg(degrees(ST_Azimuth(st_pointn(geom, idx), st_pointn(geom, idx+1)))) as orientation, node_id from "_trafficSignDirections" group by node_id;

-- update the traffic signs for which we could compute an orientation from the query above taking the `offset` into account
update "trafficSigns" 
    set tags=(tags || jsonb_build_object('direction', orientations.orientation + (tags->>'offset')::INTEGER, 'direction_source', 'way_orientation'))
    from orientations 
    where "trafficSigns".osm_id = "orientations".node_id;

-- format the direction s.t. it always lays between 0 an 360
update "trafficSigns" 
    set tags=jsonb_set(tags, '{direction}', to_jsonb(((tags->>'direction')::numeric + 360) % 360)) 
    where tags?'direction';

-- inverse the sign off all traffic signs which have offset=180 to avoid ambiguities
update "trafficSigns" set osm_id=osm_id*-1 where tags->>'offset' = '180';

-- remove `offset` from tags
update "trafficSigns" set tags=tags-'offset' ;

-- remove direction table 
drop table "_trafficSignDirections";