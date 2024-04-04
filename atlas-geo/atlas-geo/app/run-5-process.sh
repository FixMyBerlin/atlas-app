#!/bin/bash
set -e

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

source ./process-helpers.sh

# create functions needed for jsonb diffs
psql  -q -f ./JSONDiff.sql
log_start "$0"

helpers_changed=$(check_if_changed /app/process/helper/helper)
if [ "$helpers_changed" == "1" ]; then
  log "Helpers have changed. Deleting all checksums!"
  rm -f $CODE_HASHES*.lua
fi

run_lua "roads_bikelanes/roads_bikelanes"
run_psql "roads_bikelanes/bikelanes/bikelanes"

run_lua "bicycleParking/bicycleParking"

run_lua "trafficSigns/trafficSigns"
run_psql "trafficSigns/trafficSigns"

# run_lua "legacy_boundaries/boundaries"
run_lua "boundaries/boundaries"

run_lua "bikeroutes/bikeroutes"
run_lua "places/places"
run_lua_if_debug "places/places_todoList"
run_lua "landuse/landuse"
run_lua "publicTransport/publicTransport"
run_lua "poiClassification/poiClassification"
run_lua_if_debug "poiClassification/poiClassification_todoList"
run_lua "barriers/barriers"

notify "Processing finished."

log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
log "Completed:"
log "Development http://localhost:3000/catalog"
log "Staging https://staging-tiles.radverkehrsatlas.de/catalog"
log "Production https://tiles.radverkehrsatlas.de/catalog"
log "Test-Map https://data.radverkehrsatlas.de/"
log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "

log_end "$0"
