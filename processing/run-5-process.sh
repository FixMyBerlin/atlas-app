#!/bin/bash
set -e
source /processing/utils/logging.sh
source /processing/utils/hashing.sh
source ./process-helpers.sh

export PROCESS_DIR=/processing/topics/
# The folder for our code hashes, it is inside the database volume to get invalidated on deletion
export CODE_HASHES=/data/db/code_hashes/
export TABLE_INFO=/data/db/table_info/
mkdir -p $CODE_HASHES
mkdir -p $TABLE_INFO

log_start "$0"

if ! check_hash $OSM_DATADIR "osm.pbf" || [ "$SKIP_DOWNLOAD" == 0 ]; then
  log "OSM files have changed. Deleting all checksums and table info!"
  rm -f $CODE_HASHES/*
  rm -f $TABLE_INFO/*
else
  if ! check_hash "${PROCESS_DIR}helper" ".lua"; then
    log "Helpers have changed. Deleting all checksums!"
    rm -f $CODE_HASHES/*
  fi
fi

update_hash $OSM_DATADIR "osm.pbf"
update_hash "${PROCESS_DIR}helper" ".lua"



# One one .lua and one optional .sql per topic.
# Order of topics is important b/c they might rely on their data
# See [topics/README.md](./topics/README.md) for more
topics=("roads_bikelanes" "bikeroutes" "bicycleParking" "trafficSigns" "boundaries" "places" "landuse" "publicTransport" "poiClassification" "barriers")
for name in ${topics[@]}; do
  run_dir $name
done

# Call the refresh endpoint to update the generalization and export functions
curl -X GET "http://app:4000/api/private/refresh?apiKey=$ATLAS_API_KEY" &> /dev/null

notify "Processing finished."

log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
log "Completed:"
log "Development http://localhost:3000/catalog"
log "Staging https://staging-tiles.radverkehrsatlas.de/catalog"
log "Production https://tiles.radverkehrsatlas.de/catalog"
log "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "

log_end "$0"
