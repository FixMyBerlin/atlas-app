#!/bin/bash
set -e
source ./process-helpers.sh

# LUA Docs https://osm2pgsql.org/doc/manual.html#running-osm2pgsql
# One line/file per topic.
# Order of topics is important b/c they might rely on their data

echo -e "\e[1m\e[7m PROCESS – START \e[27m\e[21m – Start Time: $(date)\e[0m"


echo "Reminder: The 'bikelanes' table is available only after Postprocessing finished"
run_lua "roads_bikelanes/roads_bikelanes"
run_psql "roads_bikelanes/bikelanes/bikelanes"

run_lua "legacy_bikelanes/bikelanesPresence"
run_lua "legacy_surfaceQuality/surfaceQuality"
run_lua "legacy_roadClassification/roadClassification"
run_lua "legacy_maxspeed/maxspeed"
run_lua "legacy_lit/lit"

run_lua "legacy_boundaries/boundaries"
run_lua "boundaries/boundaries"

run_lua "places/places"
run_lua_if_debug "places/places_todoList"
run_lua "landuse"
run_lua "publicTransport"
run_lua "poiClassification/poiClassification"
run_lua_if_debug "poiClassification/poiClassification_todoList"
run_lua "barriers/barriers"

echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
echo -e "\e[1m\e[7m PROCESS – END \e[27m\e[21m – End Time: $(date)\e[0m"
echo "Completed:"
echo "Development http://localhost:7800"
echo "Staging https://staging-tiles.radverkehrsatlas.de/"
echo "Production https://tiles.radverkehrsatlas.de"
echo "✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ "
