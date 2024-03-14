#!/bin/bash
set -e

source ./process-helpers.sh
log_start "Analysis"
start_time=$(seconds)

psql -q -f "./analysis/boundaryStats.sql"

log_end "Analysis" $start_time
