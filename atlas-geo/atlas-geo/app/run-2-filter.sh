#!/bin/sh
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

FILTER_DIR="./filter/"
OSM_DATADIR="/data/" # root for docker
# OSM FILES
OSM_GERMANY=${OSM_DATADIR}openstreetmap-latest.osm.pbf
OSM_REGIONS=${OSM_DATADIR}openstreetmap-regions.osm.pbf
OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf
# FILTER
OSM_FILTER_EXPRESSIONS=${FILTER_DIR}filter-expressions.txt

echo "\e[1m\e[7m Filter – START \e[27m\e[21m"

if [ -f "${OSM_GERMANY}" ]; then

  if [ "$SKIP_FILTER" = "skip" ]; then
    echo "💥 SKIPPED with 'SKIP_FILTER=skip' in '/docker-compose.yml'"
  else
    echo "\e[1m\e[7m Filter regions (create separate files) \e[27m\e[21m"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-extract.html
    osmium extract --overwrite --polygon=${FILTER_DIR}bibi.geojson --output=${OSM_DATADIR}openstreetmap-bibi.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}trto.geojson --output=${OSM_DATADIR}openstreetmap-trto.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}eichwalde.geojson --output=${OSM_DATADIR}openstreetmap-eichwalde.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}berlin-ring.geojson --output=${OSM_DATADIR}openstreetmap-berlin.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}langerwehe.geojson --output=${OSM_DATADIR}openstreetmap-langerwehe.osm.pbf ${OSM_GERMANY}

    echo "\e[1m\e[7m Filter: Merge regions (create one file) \e[27m\e[21m"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-merge.html
    osmium merge --overwrite --output=${OSM_REGIONS} ${OSM_DATADIR}openstreetmap-bibi.osm.pbf ${OSM_DATADIR}openstreetmap-trto.osm.pbf ${OSM_DATADIR}openstreetmap-eichwalde.osm.pbf ${OSM_DATADIR}openstreetmap-berlin.osm.pbf ${OSM_DATADIR}openstreetmap-langerwehe.osm.pbf

    echo "\e[1m\e[7m Filter tags (create filtered file) \e[27m\e[21m"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
    osmium tags-filter --overwrite --output=${OSM_FILTERED_FILE} --expressions ${OSM_FILTER_EXPRESSIONS} ${OSM_REGIONS}
  fi

else
  echo "Filter: 🧨 file ${OSM_GERMANY} not found"
fi

echo "\e[1m\e[7m Filter – END \e[27m\e[21m"
