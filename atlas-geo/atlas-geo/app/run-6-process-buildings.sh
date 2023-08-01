#!/bin/bash
set -e
source ./process-helpers.sh

echo -e "\e[1m\e[7m PROCESS BUILDINGS – START \e[27m\e[21m – Start Time: $(date)\e[0m"

run_lua "buildings/buildings"
run_psql "buildings/buildings"

echo -e "\e[1m\e[7m PROCESS BUILDINGS – END \e[27m\e[21m – End Time: $(date)\e[0m"
