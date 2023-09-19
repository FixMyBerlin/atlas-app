#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"
# Create schema 'geo'
"${psql[@]}" <<- EOSQL
    CREATE SCHEMA geo;
    ALTER DATABASE $POSTGRES_DB SET search_path = "\$user",public,topology,tiger,postgis,geo;
EOSQL
