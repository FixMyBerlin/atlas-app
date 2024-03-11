#!/bin/bash
set -e

echo -e "\e[1m\e[7m Warm Cache – START \e[27m\e[21m\e[0m"

echo "Restart Martin"
docker restart tiles
sleep 10
echo "Flush Cache"
rm -rf /var/cache/nginx/*
echo "Warm Cache"
node /app/cache-warming/warmCache.js

echo -e "\e[1m\e[7m Warm Cache – END \e[27m\e[21m\e[0m"
