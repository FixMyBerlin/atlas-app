#!/bin/sh
set -e

echo "\e[1m\e[7m Postprocessing – START \e[27m\e[21m"

# start transaction
# lock database
# drop lit
# alter table rename lit_new to lit
# create lit_verified
# unlock database

psql -q -f "./POSTPROCESS.sql"
python3 ./api/init_db.py

echo "\e[1m\e[7m Postprocessing – END \e[27m\e[21m"
