#!/bin/bash
backup_table=$1_backup
table=$1
diff_table=$1_diff

psql -q -c "DROP TABLE IF EXISTS \"$diff_table\";"

query="
SELECT diff, osm_id, meta, geom INTO \"$diff_table\"
FROM (
SELECT jsonb_diff(\"$backup_table\".tags, \"$table\".tags) AS diff, \"$table\".osm_id, \"$table\".meta, \"$table\".geom
FROM \"$table\"
JOIN \"$backup_table\"
ON \"$table\".osm_id = \"$backup_table\".osm_id
) sq
WHERE diff != '{}'::jsonb;"
echo $query | psql -q

# create diffs for added rows
query="
INSERT INTO \"$diff_table\"
SELECT jsonb_prefix_values(\"$table\".tags, '(+)') as diff, \"$table\".osm_id, \"$table\".meta, \"$table\".geom
FROM \"$table\"
FULL OUTER JOIN \"$backup_table\"
ON \"$table\".osm_id = \"$backup_table\".osm_id
WHERE \"$backup_table\".osm_id IS NULL;"
echo $query | psql -q

# create diffs for deleted rows
query="
INSERT INTO \"$diff_table\"
SELECT jsonb_prefix_values(\"$backup_table\".tags, '(-)') as diff, \"$backup_table\".osm_id, \"$backup_table\".meta, \"$backup_table\".geom
FROM \"$backup_table\"
FULL OUTER JOIN \"$table\"
ON \"$backup_table\".osm_id = \"$table\".osm_id
WHERE \"$table\".osm_id IS NULL;"
echo $query | psql -q

psql -q -c "DROP TABLE \"$backup_table\";"
