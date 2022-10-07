# Useful SQL Statements for setup Verification tools

## Create table verifications
```postgresql
CREATE TABLE public.footways_verification (
	osm_type varchar NOT NULL,
	osm_id bigint NOT NULL,
	verified_at timestamp NOT NULL,
	verified_by bigint NOT NULL,
	verified varchar NULL
);
```


## Create Materialized View:
```postgresql
create materialized view highways_verified
as
select * from highways h join  highway_verification hv on hv.osm_id = h.way_id ;

# OR

create view lit_verified
as
select h.osm_type , h.osm_id , lv.verified_at , lv.verified_by , lv.verified, h.tags  from lit h
join  lit_verification lv
on lv.osm_id = h.osm_id
and lv.osm_type = h.osm_type  ;

GRANT SELECT ON TABLE public.highways_verified TO api_read;
```

## Refresh materialized view
```postgresql
REFRESH MATERIALIZED VIEW highways_verified;
```

## Analyze performance of view
```postgresql
explain analyze select * from highways_verified_live;
```
