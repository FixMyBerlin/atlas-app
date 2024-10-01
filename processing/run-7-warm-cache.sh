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
  node /processing/warm-cache/warmCache.js --config=/processing/warm-cache/config.json
fi

log_end "$0"

