#!/bin/bash
set -e

# variables shared between scripts
export OSM_DATADIR="/data/"
export OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf
export OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

# define default args
export SKIP_DOWNLOAD=${SKIP_DOWNLOAD:-0}
export SKIP_TAG_FILTER=${SKIP_TAG_FILTER:-0}
export DEBUG=${DEBUG:-0}
export ID_FILTER=${ID_FILTER:-''}
export SYNOLOGY_URL='https://fixmy.diskstation.me:54545/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token='

source ./process-helpers.sh

# Post messages to Synology Chat Channel
# The alert `text` uses Markdown and #Hash tags to highlight the message in Synology Chat
alert() {
  if [ -z $SYNOLOGY_ERROR_LOG_TOKEN ]; then
    return 0;
  fi
  local payload="{\"text\": \"#$ENVIRONMENT: $1\"}"
  local url="$SYNOLOGY_URL$SYNOLOGY_ERROR_LOG_TOKEN"
  curl -X POST $url -d "payload=$payload" --silent --output "/dev/null"
}

if ! ./run-0-wait-for-new-osm-data.sh; then
    alert '*ERROR*: #run-0-wait-for-new-osm-data exited with non-zero status code'
fi

if ! ./run-1-download.sh; then
    alert '*ERROR*: #run-1-download exited with non-zero status code'
fi

if ! ./run-2-filter.sh; then
    alert '*ERROR*: #run-2-filter exited with non-zero status code'
fi

if ! ./run-3-migration.sh; then
    alert '*ERROR*: #run-3-migration exited with non-zero status code'
fi

process_start_time=$(date +%s)
if ! ./run-4-process.sh; then
    alert '*ERROR*: #run-4-process exited with non-zero status code'
fi
process_end_time=$(date +%s)
export PROCESS_RUN_TIME_DIFF=$((process_end_time - process_start_time)) # used by metadata.sh

if ! ./run-5-postprocess.sh; then
    alert '*ERROR*: #run-5-postprocess exited with non-zero status code'
fi

if ! ./run-7-metadata.sh; then
    alert '*ERROR*: #run-7-metadata exited with non-zero status code'
fi

if ! ./run-8-warm-cache.sh; then
    alert '*ERROR*: #run-8-warm-cache exited with non-zero status code'
fi

if ! ./run-6-analysis.sh; then
    alert '*ERROR*: #run-6-analysis exited with non-zero status code'
fi
