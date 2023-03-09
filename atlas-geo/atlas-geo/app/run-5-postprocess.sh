#!/bin/sh
set -e

echo "\e[1m\e[7m Postprocessing – START \e[27m\e[21m"

# WHAT WE DO:
# start transaction
# lock database
#   drop <TABLE>
#   alter table rename _<TABLE>_temp to <TABLE>
#   create <TABLE>_verified
# unlock database

psql -q -f "./POSTPROCESS.sql"
python3 ./api/init_db.py

echo "\e[1m\e[7m Postprocessing – END \e[27m\e[21m"
