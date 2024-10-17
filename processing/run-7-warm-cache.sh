#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

log "Restart Martin"
docker restart tiles

if [ "${SKIP_WARM_CACHE:-0}" == 1 ]; then
  log "💥 SKIPPED Warm Cache with .env 'SKIP_WARM_CACHE=1'"
else
  sleep 10
  log "Flush Cache"
  rm -rf /var/cache/nginx/*
  log "Warm Cache"
  curl --silent --show-error --fail -X GET "http://app:4000/api/private/warm-cache?apiKey=$ATLAS_API_KEY" --output "/dev/null"
fi

log_end "$0"

