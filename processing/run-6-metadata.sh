#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

PROCESSED_AT=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
PROCESSING_DURATION=`date -d@$PROCESSING_DURATION -u +%H:%M:%S`
OSM_TIMESTAMP=`osmium fileinfo ${OSM_FILTERED_FILE} -g header.option.timestamp`

psql -q -c "CREATE TABLE IF NOT EXISTS public.meta (id SERIAL PRIMARY KEY, processed_at TIMESTAMP, processing_duration TIME, osm_data_from TIMESTAMP);"
psql -q -c "INSERT INTO public.meta (processed_at, processing_duration, osm_data_from) VALUES ('${PROCESSED_AT}', '${PROCESSING_DURATION}', '${OSM_TIMESTAMP}');"

log "Add timestamp ${OSM_TIMESTAMP} of file ${OSM_FILTERED_FILE} and runtime to 'meta' table."

log_end "$0"
