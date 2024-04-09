#!/bin/bash
set -e
source /app/utils/logging.sh
source /app/utils/hashing.sh
source ./process-helpers.sh

export PROCESS_DIR=/app/topics/
# The folder for our code hashes, it is inside the database volume to get invalidated on deletion
export CODE_HASHES=/data/db/code_hashes/
mkdir -p $CODE_HASHES

log_start "$0"

if ! check_hash "${PROCESS_DIR}helper" ".lua"; then
  log "Helpers have changed. Deleting all checksums!"
  rm -f $CODE_HASHES*.lua.sha
  update_hash "${PROCESS_DIR}helper" ".lua"
fi

# One one .lua and one optional .sql per topic.
# Order of topics is important b/c they might rely on their data
# See [topics/README.md](./topics/README.md) for more
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
