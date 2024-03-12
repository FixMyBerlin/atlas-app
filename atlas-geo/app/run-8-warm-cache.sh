#!/bin/bash
set -e

echo -e "\e[1m\e[7m Warm Cache – START \e[27m\e[21m\e[0m"

if [ "${SKIP_WARM_CACHE:-0}" == 1 ]; then
  echo "💥 SKIPPED Warm Cache with .env 'SKIP_WARM_CACHE=1'"
else
  echo "Restart Martin"
  docker restart tiles
  sleep 10
  echo "Flush Cache"
  rm -rf /var/cache/nginx/*
  echo "Warm Cache"
  node /app/cache-warming/warmCache.js
fi

echo -e "\e[1m\e[7m Warm Cache – END \e[27m\e[21m\e[0m"
