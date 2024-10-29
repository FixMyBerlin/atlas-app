#!/bin/bash
source /processing/utils/logging.sh
source /processing/utils/hashing.sh
source /processing/diffing/compute_diff.sh

OSM2PGSQL_BIN=/usr/bin/osm2pgsql
export PGOPTIONS="-c client_min_messages=error"

# (private function used by run_dir)
run_lua() {
  file=$1
  name=$(basename -s .lua $file)

  log_start "Run lua"
  start_time=$(seconds)

  # optional log output:
  # https://osm2pgsql.org/doc/manual.html#logging
  # `--verbose` (for --log-level=debug)
  # `--log-sql`
  # maybe even `--log-sql-data` // "This will write out a huge amount of data! "

  ${OSM2PGSQL_BIN} --number-processes=8 --create --output=flex --extra-attributes --style=$file ${OSM_FILTERED_FILE}

  end_time=$(date +%s)
  duration=$((end_time - start_time))
  duration_formatted=$(date -d@$duration -u +%M\m\ %S\s)

  notify "#$name #LUA finished in: *$duration_formatted*"
  log_end "Run lua"
}

# (private function used by run_dir)
run_psql() {
  file=$1
  # .sql files are optional, so we exit silently
  if [ ! -f "$file" ]; then
    return
  fi

  name=$(basename -s .sql $file)

  log_start "Run SQL"
  start_time=$(seconds)

  psql -q -f $file

  end_time=$(date +%s)
  duration=$((end_time - start_time))
  duration_formatted=$(date -d@$duration -u +%M\m\ %S\s)

  notify "#$name #SQL finished in: *$duration_formatted*"
  log_end "Run SQL"
}

# Main helper to run LUA _and_ SQL files.
# One one .lua and one optional .sql per topic.
# See [topics/README.md](./topics/README.md) for more
run_dir() {
  topic=$1
  directory="${PROCESS_DIR}${topic}/"
  log_start $topic

  lua_file="${directory}$topic.lua"
  sql_file="${directory}$topic.sql"

  # In this file we store the table topics after a successful run
  processed_tables="${TABLE_INFO}$topic.processed"
  backedup_tables="${TABLE_INFO}$topic.backedup"

  # Remove old diffs
  if [ -f "$processed_tables" ]; then
    for table in $(cat $processed_tables); do
      psql -q -c "DROP TABLE IF EXISTS \"${table}_diff\";"
    done
  fi

  # Skip topic if the hashes haven't changed
  if [ "$SKIP_UNCHANGED" == 1 ] && check_hash $directory ".lua" && check_hash $directory ".sql"; then
    log "💥 SKIPPED $topic – the code hash hasn't changed and .env 'SKIP_UNCHANGED=1'."
  else
    # Backup tables for diffs
    if [ "$COMPUTE_DIFFS" == 1 ]; then
      if [ -f "$processed_tables" ]; then
        for table in $(cat $processed_tables); do # iterate over tables from last run
          if [ -f $backedup_tables ] && grep -q -E "^${table}\$" "$backedup_tables" && [ "$FREEZE_DATA" == 1 ]; then
            log "Found a backup of \"$table\" (FREEZE_DATA=1)"
          else
            psql -q -c "DROP TABLE IF EXISTS backup.\"${table}\";"
            psql -q -c "CREATE TABLE backup.\"$table\" AS TABLE public.\"$table\";"
          fi
        done
        cp $processed_tables $backedup_tables
      fi
    fi

    rm -f $processed_tables # remove file in case processing craches

    run_lua $lua_file
    run_psql $sql_file

    # The code ran without errors. Updating available tables and hashes
    lua /processing/diffing/TableNames.lua $name > $processed_tables
    update_hash $directory ".lua"
    update_hash $directory ".sql"

    # Create diffs for all backedup tables that where already available
    if [ -f $backedup_tables ]; then
      log_start "Compute Diffs"
      log "Computing diffs (.env 'COMPUTE_DIFFS=1') for: $(tr '\n' ' ' < $backedup_tables)"
      for table in $(cat $backedup_tables); do
        if grep -q -E "^${table}\$" $processed_tables; then
          compute_diff $table
        else
          log "$table got deleted."
        fi
      done
      log_end "Compute Diffs"
    fi
  fi

  log_end $topic
}
