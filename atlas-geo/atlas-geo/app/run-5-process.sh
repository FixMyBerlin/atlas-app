#!/bin/bash
set -e

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

source ./process-helpers.sh

# create functions needed for jsonb diffs
export PROCESS_DIR=/app/process/
psql  -q -f ./JSONDiff.sql
log_start "$0"

if ! check_hash "${PROCESS_DIR}helper" ".lua"; then
  log "Helpers have changed. Deleting all checksums!"
  rm -f $CODE_HASHES*.lua.sha
  update_hash "${PROCESS_DIR}helper" ".lua"
fi

topics=("roads_bikelanes" "bikeroutes" "bicycleParking" "trafficSigns" "boundaries" "places" "landuse" "publicTransport" "poiClassification" "barriers")
for name in ${topics[@]}; do
  run_dir $name
done

notify "Processing finished."

log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
log "Completed:"
log "Development http://localhost:3000/catalog"
log "Staging https://staging-tiles.radverkehrsatlas.de/catalog"
log "Production https://tiles.radverkehrsatlas.de/catalog"
log "Test-Map https://data.radverkehrsatlas.de/"
log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "

log_end "$0"
