#!/bin/bash
set -e

source /processing/utils/logging.sh
log_start "$0"

psql -q -f "./migration/migration.sql"

log_end "$0"
