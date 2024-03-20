#!/bin/bash

OSM2PGSQL_BIN=/usr/bin/osm2pgsql
PROCESS_DIR="./process/"

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

run_lua() {
  log_start "$1.lua"

  start_time=$(seconds)
  # notify "PROCESS START – Topic: #$1 LUA"

  # optional log output:
  # https://osm2pgsql.org/doc/manual.html#logging
  # `--verbose` (for --log-level=debug)
  # `--log-sql`
  # maybe even `--log-sql-data` // "This will write out a huge amount of data! "
  ${OSM2PGSQL_BIN} --number-processes=8 --create --output=flex --extra-attributes --style=${PROCESS_DIR}$1.lua ${OSM_FILTERED_FILE}

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  # run_time=`date -d@$diff -u +%H:%M:%S`
  run_time=$(date -d@$diff -u +%M\m\ %S\s)

  notify "#$1 #LUA finished in: *$run_time*"

  log_end "$1.lua"
}

run_psql() {
  log_start "$1.sql"

  start_time=$(seconds)
  # notify "PROCESS START – Topic: #$1 SQL"

  psql -q -f "${PROCESS_DIR}$1.sql"

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  # run_time=`date -d@$diff -u +%H:%M:%S`
  run_time=$(date -d@$diff -u +%M\m\ %S\s)

  notify "#$1 #SQL finished in: *$run_time*"

  log_end "$1.sql"
}
