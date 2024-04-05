#!/bin/bash

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

format_left_right() {
  #format_lr(left, right, fill) {
  node -e "a='${1}';b='${2}';c='${3}' || '-';console.log(a+c.repeat(Math.max(0, 80-a.length-b.length))+b)"
}

format_now() {
  #  echo `date +"%Y-%m-%dT%H:%M:%S%z"` # with timezone
  echo $(TZ=UTC0 date +"%Y-%m-%dT%H:%M:%S")
}

seconds() {
  echo $(date +%s)
}

start_time_varname() {
  local task_safe="${1//[^a-zA-Z0-9]/_}"
  echo start_time_$task_safe
}

file_to_task() {
  # takes a filename and returns basename without extensions
  local base=$(basename $1)
  local task="${base%.*}"
  echo $task
}

log_start() {
#  local task=$(file_to_task $1)
  local task="$1"
  local varname=$(start_time_varname $task)
  declare -g $varname=$(seconds)
  local left="$(format_now) $task "
  local formatted=$(format_left_right "$left" "" ">")
  echo -e "\e[1m\e[7m${formatted}\e[27m\e[21m\e[0m"
}

log_end() {
#  local task=$(file_to_task $1)
  local task="$1"
  local varname=$(start_time_varname $task)
  local start_time="${!varname}"
  local end_time=$(seconds)
  local duration=$((end_time - start_time))
  local left="$(format_now) $task "
  local right=" $(date -d@$duration -u +%H:%M:%S)"
  local formatted=$(format_left_right "$left" "$right" "<")
  echo -e "\e[1m\e[7m${formatted}\e[27m\e[21m\e[0m"
  echo
}

log() {
  echo "$(format_now) $1"
}

notify() {
  if [ -z $SYNOLOGY_LOG_TOKEN ]; then
    return 0
  fi
  local payload="{\"text\": \"#$ENVIRONMENT: $1\"}"
  local url="$SYNOLOGY_URL$SYNOLOGY_LOG_TOKEN"
  curl -X POST $url -d "payload=$payload" --silent --output "/dev/null"
}

run_lua_if_debug() {
  if [ $DEBUG == 1 ]; then
    echo "Running $1 with .env 'DEBUG=1'"
    run_lua $1
  else
    echo "SKIPPED $1 with .env 'DEBUG=0'"
  fi
}

hash_dir() {
  directory=$1
  suffix=$2
  echo $(find "$1" -type f -name "*$suffix" | sort | xargs shasum)
}

hash_file() {
  directory=$1
  suffix=$2
  echo $CODE_HASHES$(basename $directory)$suffix.sha
}

check_hash() {
  directory=$1
  suffix=$2
  file=$(hash_file $directory $suffix)
  if [ -f "${file}" ]; then
    hash=$(hash_dir $directory $suffix)
    previous_hash=$(cat $file)
    if [ "$previous_hash" == "$hash" ]; then
      echo 0
      return
    fi
  fi
  echo 1
}

update_hash() {
  directory=$1
  suffix=$2
  file=$(hash_file $directory $suffix)
  touch $file
  hash_dir $directory $suffix > $file
}


backup_table() {
  psql -q -c "ALTER TABLE \"$1\" RENAME TO \"$1_backup\";"
}


run_lua() {
  file=$1
  if [ ! -f "$file" ]; then
    return
  fi

  name=$(basename -s .lua $file)
  log_start "$name.lua"

  start_time=$(seconds)
  # notify "PROCESS START – Topic: #$1 LUA"

  # optional log output:
  # https://osm2pgsql.org/doc/manual.html#logging
  # `--verbose` (for --log-level=debug)
  # `--log-sql`
  # maybe even `--log-sql-data` // "This will write out a huge amount of data! "

  ${OSM2PGSQL_BIN} --number-processes=8 --create --output=flex --extra-attributes --style=$file ${OSM_FILTERED_FILE}

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  # run_time=`date -d@$diff -u +%H:%M:%S`
  run_time=$(date -d@$diff -u +%M\m\ %S\s)

  notify "#$name #LUA finished in: *$run_time*"

  log_end "$name.lua"
}

run_psql() {
  file=$1
  if [ ! -f "$file" ]; then
    return
  fi

  name=$(basename -s .sql $file)
  log_start "$name.sql"

  start_time=$(seconds)
  # notify "PROCESS START – Topic: #$1 SQL"

  psql -q -f $file

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  # run_time=`date -d@$diff -u +%H:%M:%S`
  run_time=$(date -d@$diff -u +%M\m\ %S\s)

  notify "#$name #SQL finished in: *$run_time*"

  log_end "$name.sql"
}

run_dir() {
  name=$1
  directory="${PROCESS_DIR}${name}/"
  log_start $name

  lua_file="${directory}$name.lua"
  sql_file="${directory}$name.sql"

  # in this file we store the table names after a successful run
  processed_tables="${CODE_HASHES}$1.tables"
  backuped_tables="${CODE_HASHES}$1.backups"

  lua_changed=$(check_hash $directory ".lua")
  sql_changed=$(check_hash $directory ".sql")
  if [ "$sql_changed" == 0 ] && [ "$lua_changed" == 0 ] && [ "$SKIP_DOWNLOAD" == 1 ]; then
    log "💥 SKIPPED $1. The code hasn't changed."
  else
    # backup tables for diffs
    if [ "$SKIP_DOWNLOAD" == 1 ] && [ "$COMPUTE_DIFFS" == 1 ]; then
      if [ -f "$processed_tables" ]; then
        for table in $(cat $processed_tables); do # iterate over tables from last run
          psql -q -c "ALTER TABLE \"$table\" RENAME TO \"${table}_backup\";"
        done
        cp $processed_tables $backuped_tables
      fi
    fi

    rm -f $processed_tables # remove file in case processing craches

    run_lua $lua_file
    run_psql $sql_file

    # The code ran without errors. Updating available tables and hashes
    touch $processed_tables
    lua $lua_file > $processed_tables
    update_hash $directory ".lua"
    update_hash $directory ".sql"

    # create diffs for all tables that where already available
    if [ -f $backuped_tables ]; then
      for table in $(cat $backuped_tables); do
        log "Creating diff for $table."
        /app/compute_diff.sh $table
        psql -q -c "DROP TABLE \"${table}_backup\";"
      done
      rm $backuped_tables
    fi
  fi
  log_end $name
}
