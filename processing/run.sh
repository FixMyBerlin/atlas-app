#!/bin/bash
set -e

# variables shared between scripts
export OSM_DATADIR="/data/"
export OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf
export OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

# define default args
export SKIP_DOWNLOAD=${SKIP_DOWNLOAD:-0}
export SKIP_TAG_FILTER=${SKIP_TAG_FILTER:-0}
export COMPUTE_DIFFS=${COMPUTE_DIFFS:-0}
export FREEZE_DATA=${FREEZE_DATA:-0}
export ID_FILTER=${ID_FILTER:-''}
export SYNOLOGY_URL='https://fixmystation.de8.quickconnect.to/direct/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token='

source /processing/utils/logging.sh


if ! ./run-1-wait-for-fresh-data.sh; then
    alert '*ERROR*: #run-1-wait-for-fresh-data exited with non-zero status code'
fi

if ! ./run-2-download.sh; then
    alert '*ERROR*: #run-2-download exited with non-zero status code'
fi

if ! ./run-3-filter.sh; then
    alert '*ERROR*: #run-3-filter exited with non-zero status code'
fi

if ! ./run-4-migration.sh; then
    alert '*ERROR*: #run-4-migration exited with non-zero status code'
fi

process_start_time=$(date +%s)
if ! ./run-5-process.sh; then
    alert '*ERROR*: #run-5-process exited with non-zero status code'
fi
process_end_time=$(date +%s)
export PROCESSING_DURATION=$((process_end_time - process_start_time)) # used by metadata.sh

if ! ./run-6-metadata.sh; then
    alert '*ERROR*: #run-6-metadata exited with non-zero status code'
fi

if ! ./run-7-warm-cache.sh; then
    alert '*ERROR*: #run-7-warm-cache exited with non-zero status code'
fi
