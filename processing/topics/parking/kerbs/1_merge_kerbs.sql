-- create one table where connected linestrings are merged which is later used to snap to
DROP TABLE IF EXISTS parking_kerbs_merged;

-- ST_LineMerge is greedy and merges on intersections might result in artefacts
SELECT (ST_Dump(ST_LineMerge(ST_Collect(geom)))).geom as geom INTO parking_kerbs_merged  from parking_kerbs_moved;

ALTER TABLE parking_kerbs_merged
ALTER COLUMN geom TYPE geometry(Geometry, 5243)
USING ST_SetSRID(geom, 5243);

-- create an index on the merged table
DROP INDEX IF EXISTS parking_kerbs_merged_idx;
CREATE INDEX parking_kerbs_merged_idx ON parking_kerbs_merged USING GIST (geom);
