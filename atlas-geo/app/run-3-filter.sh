#!/bin/bash
set -e

source /app/utils/logging.sh
log_start "$0"

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

FILTER_DIR="./filter/"

OSM_FILTER_EXPRESSIONS=${FILTER_DIR}filter-expressions.txt
OSM_INTERMEDIATE_FILE=${FILTER_DIR}intermediate.pbf

if [ $SKIP_TAG_FILTER == 1 ]; then
  log "💥 SKIPPED tag filter with .env 'SKIP_TAG_FILTER=1'"
  ln -f ${OSM_LOCAL_FILE} ${OSM_FILTERED_FILE}
else
  # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
  osmium tags-filter --overwrite --expressions ${OSM_FILTER_EXPRESSIONS} --output=${OSM_FILTERED_FILE} ${OSM_LOCAL_FILE}
fi

# TODO: It looks like this does not work.
# TODO: There is an issue when we overwrite the 'OSM_FILTERED_FILE' because in line 16 we move it but after we moved it the prev file is not there anymore. Which means on the next run the original file will be gone. And the downloaded file has different names like "brandenburg-…"
if [ "$ID_FILTER" != "" ]; then
  log -e "\e[1m\e[7m FILTER BY osm-id ${ID_FILTER}\e[27m\e[21m\e[0m"
  osmium getid --overwrite --output=${OSM_INTERMEDIATE_FILE} --verbose-ids ${OSM_FILTERED_FILE} ${ID_FILTER}
  mv ${OSM_INTERMEDIATE_FILE} ${OSM_FILTERED_FILE}
fi

log_end "$0"
