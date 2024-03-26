#!/bin/bash
set -e

source ./process-helpers.sh
log_start "$0"

if [ "${SKIP_WARM_CACHE:-0}" == 1 ]; then
  log "💥 SKIPPED Warm Cache with .env 'SKIP_WARM_CACHE=1'"
else
  log "Restart Martin"
  docker restart tiles
  sleep 10
  log "Flush Cache"
  rm -rf /var/cache/nginx/*
  log "Warm Cache"
  node /app/warm-cache/warmCache.js
fi

log_end "$0"
