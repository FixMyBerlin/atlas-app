#!/bin/bash
set -e

source ./process-helpers.sh
log_start "$0"

# use a file as a flag because it's not possible to pass arguments to docker restart
FILE="/app/arguments/wait-for-fresh-data"

if test -f $FILE;
  then
    log "✓ Waiting for fresh data because $FILE exists."
    rm $FILE
    node ./run-1-wait-for-fresh-data.js $OSM_DOWNLOAD_URL
  else
    log "💥 SKIPPED because file $FILE does not exist."
fi

log_end "$0"
