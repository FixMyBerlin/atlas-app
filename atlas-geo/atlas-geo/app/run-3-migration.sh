#!/bin/bash
set -e

echo "\e[1m\e[7m DB Cleanup & Migrations START \e[27m\e[21m"

psql -q -f "./migration/cleanup.sql"
psql -q -f "./migration/migration.sql"

echo "\e[1m\e[7m DB Cleanup & Migrations – END \e[27m\e[21m"
