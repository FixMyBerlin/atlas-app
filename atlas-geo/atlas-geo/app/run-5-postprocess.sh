#!/bin/bash
set -e

echo -e "\e[1m\e[7m Postprocessing – START \e[27m\e[21m\e[0m"

# WHAT WE DO:
# start transaction
# lock database
#   drop <TABLE>
#   alter table rename _<TABLE>_temp to <TABLE>
#   create <TABLE>_verified
# unlock database

psql -q -f "./POSTPROCESS.sql"
curl -G -d "secret=$API_SECRET" api/init 
# TODO: call api init endpoint