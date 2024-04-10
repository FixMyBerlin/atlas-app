#!/bin/bash
set -e

source /app/utils/logging.sh
log_start "$0"

psql -q -f "./analysis/boundaryStats.sql"

log_end "$0"
