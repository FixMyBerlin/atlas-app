#!/bin/sh
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

PROCESS_DIR="./process/"
OSM_DATADIR="/data/" # root for docker
OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf
OSM_TIMESTAMP=`osmium fileinfo ${OSM_LOCAL_FILE} -g header.option.timestamp`
echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 SQL: add timestamp of osm file ${OSM_TIMESTAMP} to some database table"

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: boundaries"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}boundaries.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}boundaries.sql"
# psql -q -c "COMMENT ON TABLE boundaries_stats IS '${OSM_TIMESTAMP}';"

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: places"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}places.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: places_todoList"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}places_todoList.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: fromTo_education"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}fromTo_education.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: fromTo_landuse"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}fromTo_landuse.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: fromTo_publicTransport"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}fromTo_publicTransport.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: fromTo_shopping"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}fromTo_shopping.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: fromTo_shopping_todoList"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}fromTo_shopping_todoList.lua ${OSM_FILTERED_FILE}

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: roadtypesOsm"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}roadtypesOsm.lua ${OSM_FILTERED_FILE}
psql -q -f "${PROCESS_DIR}roadtypesOsm.sql"

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: lit"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}lit.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}lit.sql"

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: bicycleRoadInfrastructure.lua"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}bicycleRoadInfrastructure.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}bicycleRoadInfrastructure.lua.sql"

# echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
# echo "🥐 LUA+SQL for Topic: parking"
# ${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}parking.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}parking.sql"

# ====
# This should be the last step…
echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 LUA+SQL for Topic: Metadata"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}metadata.lua ${OSM_FILTERED_FILE}
# Provide meta data for the frontend application.
# We missuse a feature of pg_tileserve for this. Inspired by Lars parking_segements code <3.
# 1. We create the metadata table in LUA with some dummy data
#    (the office of changing cities; since FMC does not have an OSM node)
#    But we don't use this geo data in any ways.
# 2. We use the "comment" feature of gp_tileserve, see https://github.com/CrunchyData/pg_tileserv#layers-list
#    This levarages a PostgreSQL feature where columns, index and table can have a text "comment".
#    The "comment" field on the table is retured by the pg_tileserve schema JSON as "description"
#    See https://tiles.radverkehrsatlas.de/public.metadata.json
# 3. Our data is a manually stringified JSON which shows…
#    - osm_data_from – DateTime when Geofabrik (our source of data) processed the OSM data
#    - processed_at – DateTime of this processing step
#    Which means, we do not actually know the age of the data,
#    which would be the DateTime when Geofabrik pulled the data from the OSM server.
PROCESSED_AT=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
psql -q -c "COMMENT ON TABLE metadata IS '{\"osm_data_from\":\"${OSM_TIMESTAMP}\", \"processed_at\": \"${PROCESSED_AT}\"}';"

echo "✅ completed. Preview the data at http://localhost:7800 with live data at https://tiles.radverkehrsatlas.de"
