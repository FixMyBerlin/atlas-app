#!/bin/sh
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

PROCESS_DIR="./process/"
OSM_DATADIR="/data/" # root for docker
OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

echo "\e[1m\e[7m PROCESS – START \e[27m\e[21m"

# lit and bikelanes should be at the top, so it's available ASAP
echo "\e[1m\e[7m PROCESS – Topic: lit \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}lit/lit.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: bikelanes \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}bikelanes/bikelanes.lua ${OSM_FILTERED_FILE}
echo "\e[1m\e[7m PROCESS – Topic: bikelanes \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}bikelanes/bikelanesNew.lua ${OSM_FILTERED_FILE}
# TODO: Enable when bug is fixed
psql -q -f "${PROCESS_DIR}bikelanes/bikelanesCenterline.sql"

echo "\e[1m\e[7m PROCESS – Topic: boundaries \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}boundaries.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: places \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}places/places.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: places_todoList \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}places/places_todoList.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: education \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}education.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: landuse \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}landuse.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: publicTransport \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}publicTransport.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: poiClassification \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}poiClassification.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: poiClassification_todoList \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}poiClassification_todoList.lua ${OSM_FILTERED_FILE}

echo "\e[1m\e[7m PROCESS – Topic: roadClassification \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}roadClassification.lua ${OSM_FILTERED_FILE}
psql -q -f "${PROCESS_DIR}roadClassification.sql"

echo "\e[1m\e[7m PROCESS – Topic: maxspeed \e[27m\e[21m"
${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}maxspeed/maxspeed.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}maxspeed/maxspeed.sql"


# echo "\e[1m\e[7m PROCESS – Topic: parking \e[27m\e[21m"
# ${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}parking.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}parking.sql"

# ================================================
# This should be the last step…
OSM_TIMESTAMP=`osmium fileinfo ${OSM_LOCAL_FILE} -g header.option.timestamp`
echo "\e[1m\e[7m PROCESS – Topic: Metadata \e[27m\e[21m"
echo "Add timestamp ${OSM_TIMESTAMP} of file ${OSM_LOCAL_FILE} to some metadata table"

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

echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
echo "\e[1m\e[7m PROCESS – END \e[27m\e[21m"
echo "Completed:"
echo "Development http://localhost:7800"
echo "Staging https://staging-tiles.radverkehrsatlas.de/"
echo "Production https://tiles.radverkehrsatlas.de"
echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
