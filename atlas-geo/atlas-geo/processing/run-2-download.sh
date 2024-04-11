#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

OSM_DOWNLOAD_FILE="${OSM_DATADIR}$(basename $OSM_DOWNLOAD_URL)"
if [ $SKIP_DOWNLOAD == 1 ]; then
  if [ -f "${OSM_DOWNLOAD_FILE}" ]; then
    log "💥 SKIPPED download with .env 'SKIP_DOWNLOAD=1'"
    ln -f ${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
    log_end "$0"
    exit 0;
  else
    log "Can't skip download, no file was found."
  fi
fi

log "Downloading file: ${OSM_DOWNLOAD_URL}"
# Note: Showing the progress (locally) is very verbose, unfortunately
if wget --timestamping --no-verbose ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}; then
  ln -f ${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
else
  log "Error: Failed to download the file from ${OSM_DOWNLOAD_URL}"
fi

log_end "$0"
