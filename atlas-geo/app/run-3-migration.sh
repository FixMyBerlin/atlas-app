#!/bin/bash
set -e

echo -e "\e[1m\e[7m DB Cleanup & Migrations START \e[27m\e[21m\e[0m"

psql -q -f "./migration/cleanup.sql"
psql -q -f "./migration/migration.sql"

echo -e "\e[1m\e[7m DB Cleanup & Migrations – END \e[27m\e[21m\e[0m"
