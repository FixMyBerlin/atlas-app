#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

MAX_TRIES=12
TIMEOUT_M=10
TIMEOUT_S=$(($TIMEOUT_M * 60))
DATE_FORMAT="+%F"

file_date=""
todays_date=$(date $DATE_FORMAT)
remaining_tries=$MAX_TRIES

if [ "$WAIT_FOR_FRESH_DATA" != 1 ]; then
  log "We are not waiting for fresh data."
fi

while [ "$WAIT_FOR_FRESH_DATA" == 1 ] ; do
  remaining_tries=$(($remaining_tries - 1))
  # get the file's date from the header
  file_date=$(curl -sIL "$OSM_DOWNLOAD_URL" | grep -i "Last-Modified" | cut -d' ' -f2-)
  file_date=$(date -d "$file_date" "$DATE_FORMAT")
  # if the file is from today break the loop
  if [ "$todays_date" == "$file_date" ]; then
    log "File is from today ($file_date). Continuing"
    break
  fi

  if [ "$remaining_tries" -lt "1" ]; then
    log "File is from $file_date. We'll continue because we exceeded MAX_TRIES=$MAX_TRIES."
    alert "Data is not fresh. File is from $file_date."
    break
  fi

  log "File is from $file_date. We'll retry in $TIMEOUT_M min. $remaining_tries tries remaining."
  sleep $TIMEOUT_S
done

log_end "$0"
