#!/bin/bash
set -e

source ./process-helpers.sh
log_start "$0"

# WHAT WE DO:
# start transaction
# lock database
#   drop <TABLE>
#   alter table rename _<TABLE>_temp to <TABLE>
#   create <TABLE>_verified
# unlock database

psql -q -f "./POSTPROCESS.sql"

log_end "$0"
