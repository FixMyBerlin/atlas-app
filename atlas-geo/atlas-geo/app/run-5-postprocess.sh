#!/bin/bash
set -e

source ./process-helpers.sh
log_start "Postprocessing"
start_time=$(seconds)

# WHAT WE DO:
# start transaction
# lock database
#   drop <TABLE>
#   alter table rename _<TABLE>_temp to <TABLE>
#   create <TABLE>_verified
# unlock database

psql -q -f "./POSTPROCESS.sql"

log_end "Postprocessing" $start_time
