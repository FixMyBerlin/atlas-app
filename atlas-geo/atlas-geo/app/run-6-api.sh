#!/bin/bash
set -e

echo -e "\e[1m\e[7m API – START \e[27m\e[21m\e[0m"

echo -e "INFO: Call api/init to create verification tables and export functions"
curl -G -d "secret=$API_SECRET" api/init --silent --output '/dev/null'

echo -e "\e[1m\e[7m API – END \e[27m\e[21m\e[0m"
