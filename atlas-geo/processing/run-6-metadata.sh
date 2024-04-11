#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

# Provide meta data for the frontend application.
# We missuse a feature of pg_tileserve for this. Inspired by Lars parking_segements code <3.
# 1. We reuse the 'bikelanes' table to store the metadata
#    (We used a metadata table before, but creating this takes ~10 Min which is too long…)
# 2. We use the "comment" feature of gp_tileserve, see https://github.com/CrunchyData/pg_tileserv#layers-list
#    This levarages a PostgreSQL feature where columns, index and table can have a text "comment".
#    The "comment" field on the table is retured by the pg_tileserve schema JSON as "description"
#    See https://tiles.radverkehrsatlas.de/public.metadata.json
# 3. Our data is a manually stringified JSON which shows…
#    - osm_data_from – DateTime when Geofabrik (our source of data) processed the OSM data
#    - processed_at – DateTime of this processing step
#    Which means, we do not actually know the age of the data,
#    which would be the DateTime when Geofabrik pulled the data from the OSM server.

OSM_TIMESTAMP=`osmium fileinfo ${OSM_FILTERED_FILE} -g header.option.timestamp`
PROCESSED_AT=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
PROCESSING_DURATION=`date -d@$PROCESSING_DURATION -u +%H:%M`

log "Add timestamp ${OSM_TIMESTAMP} of file ${OSM_FILTERED_FILE} and runtime to metadata table 'bikelanes'"

psql -q -c "COMMENT ON TABLE bikelanes IS '{\"osm_data_from\":\"${OSM_TIMESTAMP}\", \"processed_at\": \"${PROCESSED_AT}\", \"processing_duration\": \"${PROCESSING_DURATION} h\"}';"

log_end "$0"
