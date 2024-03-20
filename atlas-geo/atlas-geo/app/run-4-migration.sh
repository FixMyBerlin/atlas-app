#!/bin/bash
set -e

source ./process-helpers.sh
log_start "$0"

psql -q -f "./migration/cleanup.sql"
psql -q -f "./migration/migration.sql"

log_end "$0"
