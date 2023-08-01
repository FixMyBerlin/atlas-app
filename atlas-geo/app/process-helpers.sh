
OSM2PGSQL_BIN=/usr/bin/osm2pgsql
PROCESS_DIR="./process/"
# Set a default value for DEBUG if it's not defined
DEBUG=${DEBUG:-0}

run_lua_if_debug() {
  if [ $DEBUG == 1 ]; then
    echo "Running $1 with .env 'DEBUG=1'"
    run_lua $1
  else
    echo "SKIPPED $1 with .env 'DEBUG=0'"
  fi
}

run_lua() {
  start_time=$(date +%s)
  echo -e "\e[1m\e[7m PROCESS START – Topic: $1 LUA \e[27m\e[21m\e[0m"

  ${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}$1.lua ${OSM_FILTERED_FILE}

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  run_time=`date -d@$diff -u +%H:%M:%S`
  echo -e "\e[1m\e[7m PROCESS END – Topic: $1 LUA \e[27m\e[21m took $run_time\e[0m"
}

run_psql() {
  start_time=$(date +%s)
  echo -e "\e[1m\e[7m PROCESS START – Topic: $1 SQL \e[27m\e[21m\e[0m"

  psql -q -f "${PROCESS_DIR}$1.sql"

  end_time=$(date +%s)
  diff=$((end_time - start_time))
  run_time=`date -d@$diff -u +%H:%M:%S`
  echo -e "\e[1m\e[7m PROCESS END – Topic: $1 SQL \e[27m\e[21m took $run_time\e[0m"
}
