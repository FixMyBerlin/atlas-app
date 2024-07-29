#!/bin/bash
source /processing/utils/logging.sh
source /processing/utils/hashing.sh
source /processing/diffing/compute_diff.sh

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

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

  if check_hash $directory ".lua" && check_hash $directory ".sql"; then
    log "💥 SKIPPED $topic – the code hash hasn't changed and .env 'SKIP_DOWNLOAD=1'."
    if [ -f "$processed_tables" ]; then
      for table in $(cat $processed_tables); do
        # Remove old diffs
        psql -q -c "DROP TABLE IF EXISTS \"${table}_diff\";" &> /dev/null
      done
    fi
  else
    # Backup tables for diffs
    if [ "$COMPUTE_DIFFS" == 1 ]; then
      if [ -f "$processed_tables" ]; then
        for table in $(cat $processed_tables); do # iterate over tables from last run
          psql -q -c "DROP TABLE IF EXISTS \"${table}_backup\";" &> /dev/null
          psql -q -c "ALTER TABLE \"$table\" RENAME TO \"${table}_backup\";"
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
        if [ "$FREEZE_DATA" == 1 ]; then
          psql -q -c "DROP TABLE \"${table}\";"
          psql -q -c "ALTER TABLE \"${table}_backup\" RENAME TO \"${table}\";"
        else
          psql -q -c "DROP TABLE \"${table}_backup\";"
        fi
      done
      if [ "$FREEZE_DATA" == 1 ]; then
        log "Restored data (.env 'FREEZE_DATA=1')"
        mv -f $backedup_tables $processed_tables
      else
        rm $backedup_tables
      fi
      log_end "Compute Diffs"
    fi
  fi

  log_end $topic
}
