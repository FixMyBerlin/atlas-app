#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"
# Create schema 'geo'
"${psql[@]}" <<- 'EOSQL'
    CREATE SCHEMA geo;
EOSQL

echo "Move postgis extension to separate schema"
"${psql[@]}" <<-EOSQL
    CREATE SCHEMA postgis;

    ALTER DATABASE $POSTGRES_DB SET search_path = "\$user",public,topology,tiger,postgis,geo;

    -- Temporarily make postis relocatable
    UPDATE pg_extension SET extrelocatable = true WHERE extname = 'postgis';

    -- Relocate it
    ALTER EXTENSION postgis SET SCHEMA postgis;

    -- Made postis non relocatable
    UPDATE pg_extension SET extrelocatable = false WHERE extname = 'postgis';
EOSQL
