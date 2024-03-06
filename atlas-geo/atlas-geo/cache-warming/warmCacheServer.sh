#!/bin/sh

cd /home/quirky-penguin/cache-warming/
./warmCache.js 2>&1 | tee -a /tmp/log/cache-warming-$(date "+%FT%T").log 2>&1
