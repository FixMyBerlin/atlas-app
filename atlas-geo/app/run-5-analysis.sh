#!/bin/bash
set -e

echo -e "\e[1m\e[7m Analysis – START \e[27m\e[21m\e[0m"

psql -q -f "./analysis/boundaryStats.sql"

echo -e "\e[1m\e[7m Analysis – END \e[27m\e[21m\e[0m"