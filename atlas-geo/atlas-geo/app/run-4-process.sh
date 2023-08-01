#!/bin/bash
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

PROCESS_DIR="./process/"

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

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

process_start_time=$(date +%s)
echo -e "\e[1m\e[7m PROCESS – START \e[27m\e[21m – Start Time: $(date)\e[0m"

# lit and bikelanes should be at the top, so it's available ASAP
echo "Reminder: The 'lit' table is available only after Postprocessing finished"
run_lua "lit/lit"

echo "Reminder: The 'bikelanes' table is available only after Postprocessing finished"
run_lua "bikelanes/bikelanes"
run_psql "bikelanes/bikelanes"

run_lua "boundaries"
run_lua "places/places"
run_lua "places/places_todoList"
run_lua "education"
run_lua "landuse"
run_lua "publicTransport"
run_lua "poiClassification/poiClassification"
run_lua "poiClassification/poiClassification_todoList"

run_lua "buildings/buildings"
# run_psql "buildings/buildings" # TODO: Deactivated for now, this takes way too long
#   > app  | PROCESS START – Topic: buildings/buildings SQL
#   > app  | psql:process/buildings/buildings.sql:1: NOTICE:  table "buildings" does not exist, skipping
#   > app  | psql:process/buildings/buildings.sql:4: SSL SYSCALL error: EOF detected
#   > app  | psql:process/buildings/buildings.sql:4: error: connection to server was lost
#   > app exited with code 2

run_lua "roadClassification/roadClassification"
run_lua "maxspeed/maxspeed"
run_lua "barriers/barriers"
run_lua "surfaceQuality/surfaceQuality"

# ================================================
# This should be the last step…
OSM_TIMESTAMP=`osmium fileinfo ${OSM_LOCAL_FILE} -g header.option.timestamp`
echo -e "\e[1m\e[7m PROCESS – Topic: Metadata \e[27m\e[21m\e[0m"
echo "Add timestamp ${OSM_TIMESTAMP} of file ${OSM_LOCAL_FILE} to some metadata table"

${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}metadata.lua ${OSM_FILTERED_FILE}
# Provide meta data for the frontend application.
# We missuse a feature of pg_tileserve for this. Inspired by Lars parking_segements code <3.
# 1. We create the metadata table in LUA with some dummy data
#    (the office of changing cities; since FMC does not have an OSM node)
#    But we don't use this geo data in any ways.
# 2. We use the "comment" feature of gp_tileserve, see https://github.com/CrunchyData/pg_tileserv#layers-list
#    This levarages a PostgreSQL feature where columns, index and table can have a text "comment".
#    The "comment" field on the table is retured by the pg_tileserve schema JSON as "description"
#    See https://tiles.radverkehrsatlas.de/public.metadata.json
# 3. Our data is a manually stringified JSON which shows…
#    - osm_data_from – DateTime when Geofabrik (our source of data) processed the OSM data
#    - processed_at – DateTime of this processing step
#    Which means, we do not actually know the age of the data,
#    which would be the DateTime when Geofabrik pulled the data from the OSM server.
process_end_time=$(date +%s)
diff=$((process_end_time - process_start_time))

RUN_TIME=`date -d@$diff -u +%H:%M`
PROCESSED_AT=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
psql -q -c "COMMENT ON TABLE metadata IS '{\"osm_data_from\":\"${OSM_TIMESTAMP}\", \"processed_at\": \"${PROCESSED_AT}\", \"run_time\": \"${RUN_TIME} h\"}';"


echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
echo -e "\e[1m\e[7m PROCESS – END \e[27m\e[21m – End Time: $(date), took $RUN_TIME h [0m"
echo "Completed:"
echo "Development http://localhost:7800"
echo "Staging https://staging-tiles.radverkehrsatlas.de/"
echo "Production https://tiles.radverkehrsatlas.de"
echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
