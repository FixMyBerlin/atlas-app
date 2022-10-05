# Useful SQL Statements for setup Verification tools

## Create table verifications
```postgresql
CREATE TABLE public.footway_verification (
	osm_type varchar NOT NULL,
	osm_id bigint NOT NULL,
	verified_at timestamp NOT NULL,
	verified varchar NULL
);
```


## Create Materialized View:
```postgresql
create materialized view highways_verified
as
select * from highways h join  highway_verification hv on hv.osm_id = h.way_id ;

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
