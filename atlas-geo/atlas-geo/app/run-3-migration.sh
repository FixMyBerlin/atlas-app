#!/bin/bash
set -e

source ./process-helpers.sh
log_start "DB Cleanup & Migrations"
start_time=$(seconds)

psql -q -f "./migration/cleanup.sql"
psql -q -f "./migration/migration.sql"

log_end "DB Cleanup & Migrations" $start_time
