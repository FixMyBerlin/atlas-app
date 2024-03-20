#!/bin/bash
set -e

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

source ./process-helpers.sh
log_start "$0"

log "Reminder: The 'bikelanes' table is available only after Postprocessing finished"
run_lua "roads_bikelanes/roads_bikelanes"
run_psql "roads_bikelanes/bikelanes/bikelanes"

run_lua "bicycleParking/bicycleParking"

run_lua "trafficSigns/trafficSigns"
run_psql "trafficSigns/trafficSigns"

# run_lua "legacy_boundaries/boundaries"
run_lua "boundaries/boundaries"

run_lua "places/places"
run_lua_if_debug "places/places_todoList"
run_lua "landuse"
run_lua "publicTransport"
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
