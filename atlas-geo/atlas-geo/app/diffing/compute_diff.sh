
#!/bin/bash
source /app/utils/logging.sh

# Create functions needed for jsonb diffs
psql -q -f /app/diffing/JSONDiff.sql &> /dev/null

# (private function used by run_dir)
compute_diff() {
  backup_table=$1_backup
  table=$1
  diff_table=$1_diff

  psql -q -c "DROP TABLE IF EXISTS \"$diff_table\";" &> /dev/null

  columns="tags, osm_id, meta, geom"

  # Compute diff of `tags` column using `jsonb_diff` from `JSONDiff.sql`
  query="
    SELECT $columns
    INTO \"$diff_table\"
    FROM (
      SELECT
        jsonb_diff(\"$backup_table\".tags, \"$table\".tags) AS tags,
        \"$table\".osm_id, \"$table\".meta, \"$table\".geom
      FROM \"$table\"
      JOIN \"$backup_table\"
        ON \"$table\".osm_id = \"$backup_table\".osm_id
    ) sq
    WHERE tags != '{}'::jsonb;
    UPDATE  \"$diff_table\" SET tags = tags || '{\"CHANGE\": \"modified\"}'::jsonb;
    SELECT count(osm_id) FROM \"$diff_table\";"
  n_modified=$(echo $query | psql -q -t -A)

  # Add new rows to diff table
  query="
    CREATE TEMP TABLE added_rows AS
      SELECT
        jsonb_prefix_values(\"$table\".tags, '(+)') as tags,
        \"$table\".osm_id,
        \"$table\".meta,
        \"$table\".geom
      FROM \"$table\"
      FULL OUTER JOIN \"$backup_table\"
        ON \"$table\".osm_id = \"$backup_table\".osm_id
      WHERE \"$backup_table\".osm_id IS NULL;
    UPDATE  added_rows SET tags = tags || '{\"CHANGE\": \"added\"}'::jsonb;
    SELECT count(*) FROM added_rows;
    INSERT INTO \"$diff_table\" SELECT $columns FROM added_rows;"
  n_added=$(echo $query | psql -q -t -A)

  # Add delted rows to diff table
  query="
    CREATE TEMP TABLE deleted_rows AS
      SELECT
        jsonb_prefix_values(\"$backup_table\".tags, '(-)') || jsonb_build_object('CHANGE', 'deleted') as tags,
        \"$backup_table\".osm_id,
        \"$backup_table\".meta,
        \"$backup_table\".geom
      FROM \"$backup_table\"
      FULL OUTER JOIN \"$table\"
        ON \"$backup_table\".osm_id = \"$table\".osm_id
      WHERE \"$table\".osm_id IS NULL;
    UPDATE  deleted_rows SET tags = tags || '{\"CHANGE\": \"deleted\"}'::jsonb;
    SELECT count(*) FROM deleted_rows;
    INSERT INTO \"$diff_table\" SELECT $columns FROM deleted_rows;"
  n_deleted=$(echo $query | psql -q -t -A)

  # TODO: write as table _comment_.
  n_changes=$(psql -t -A -c "SELECT count(*) FROM \"$diff_table\";")
  if [ "$n_changes" == 0 ]; then
    log "$n_changes changes in $table."
    # Cleanup
    psql -q -c "DROP TABLE \"$diff_table\";"
  else
    log "$n_changes changes in $table:"
    log "    $n_added entries added."
    log "    $n_deleted entries deleted."
    log "    $n_modified entries modified."
  fi

}
