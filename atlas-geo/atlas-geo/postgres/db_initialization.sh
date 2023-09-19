#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"
# Create schema 'geo'
"${psql[@]}" <<- 'EOSQL'
    CREATE SCHEMA geo;
EOSQL
