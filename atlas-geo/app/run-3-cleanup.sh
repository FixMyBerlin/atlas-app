#!/bin/sh
set -e

echo "\e[1m\e[7m Cleanup – START \e[27m\e[21m"

psql -q -f "./cleanup/cleanup.sql"

echo "\e[1m\e[7m Cleanup – END \e[27m\e[21m"
