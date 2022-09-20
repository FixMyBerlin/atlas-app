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

# echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
# echo "🥐 LUA+SQL for Topic: parking"
# ${OSM2PGSQL_BIN} --create --output=flex --extra-attributes --style=${PROCESS_DIR}parking.lua ${OSM_FILTERED_FILE}
# psql -q -f "${PROCESS_DIR}parking.sql"
# psql -q -c "COMMENT ON TABLE highways IS '${OSM_TIMESTAMP}';"
# psql -q -c "COMMENT ON TABLE parking_segments IS '${OSM_TIMESTAMP}';"
# psql -q -c "COMMENT ON TABLE parking_spaces IS '${OSM_TIMESTAMP}';"

echo "✅ completed. Preview the data at http://localhost:7800/"
