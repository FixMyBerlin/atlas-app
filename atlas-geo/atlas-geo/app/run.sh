#!/bin/bash
set -e

# variables shared between scripts
export OSM_DATADIR="/data/"
export OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf
export OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

./run-1-download.sh
./run-2-filter.sh
./run-3-migration.sh

process_start_time=$(date +%s)
./run-4-process.sh
process_end_time=$(date +%s)
export PROCESS_RUN_TIME_DIFF=$((process_end_time - process_start_time)) # used by metadata.sh

./run-5-metadata.sh
./run-6-postprocess.sh
