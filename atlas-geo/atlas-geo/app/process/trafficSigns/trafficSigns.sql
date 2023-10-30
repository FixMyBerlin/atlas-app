-- compute the orientation based on adjacent nodes
create temp table orientations as select avg(degrees(ST_Azimuth(st_pointn(geom, idx), st_pointn(geom, idx+1)))) as orientation, node_id from "_trafficSignDirections" group by node_id;

-- update the traffic signs for which we could compute an orientation from the query above taking the `offset` into account
update "trafficSigns" 
    set tags=(tags || jsonb_build_object('direction', (orientations.orientation + (tags->>'offset')::INTEGER)::numeric % 360)) 
    from orientations 
    where "trafficSigns".osm_id = "orientations".node_id;

--TODO: extract modulo operation into seperate line to get rid of negative directions e.g. (direction+360) % 360

-- inverse the sign off all traffic signs which have an offset to avoid ambiguities
update "trafficSigns" set osm_id=osm_id*-1 where tags->>'offset' = '180';

-- remove `offset` from tags
update "trafficSigns" set tags=tags-'offset' ;

-- remove direction table 
drop table "_trafficSignDirections";