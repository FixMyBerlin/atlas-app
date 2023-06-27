#!/bin/bash
set -e

# variables shared between scripts
export OSM_DATADIR="/data/"
export OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf
export OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

./run-1-download.sh
./run-2-filter.sh
./run-3-migration.sh
./run-4-process.sh
./run-5-postprocess.sh
