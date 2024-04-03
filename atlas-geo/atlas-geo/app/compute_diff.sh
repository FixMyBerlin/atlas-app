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


# TODO add deleted and added rows to diff table
psql -q -c "DROP TABLE \"$backup_table\";"
