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

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 osmium: filter osm data – START"

if [ -f "${OSM_GERMANY}" ]; then

  if [ "$SKIP_FILTER" = "true" ]; then
    echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
    echo "🥐 osmium: filter regions, create separate files"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-extract.html
    osmium extract --overwrite --polygon=${FILTER_DIR}bibi.geojson --output=${OSM_DATADIR}openstreetmap-bibi.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}trto.geojson --output=${OSM_DATADIR}openstreetmap-trto.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}eichwalde.geojson --output=${OSM_DATADIR}openstreetmap-eichwalde.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}berlin-ring.geojson --output=${OSM_DATADIR}openstreetmap-berlin.osm.pbf ${OSM_GERMANY}
    osmium extract --overwrite --polygon=${FILTER_DIR}langerwehe.geojson --output=${OSM_DATADIR}openstreetmap-langerwehe.osm.pbf ${OSM_GERMANY}

    echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
    echo "🥐 osmium: merge regions, create one file"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-merge.html
    osmium merge --overwrite --output=${OSM_REGIONS} ${OSM_DATADIR}openstreetmap-bibi.osm.pbf ${OSM_DATADIR}openstreetmap-trto.osm.pbf ${OSM_DATADIR}openstreetmap-eichwalde.osm.pbf ${OSM_DATADIR}openstreetmap-berlin.osm.pbf ${OSM_DATADIR}openstreetmap-langerwehe.osm.pbf

    echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
    echo "🥐 osmium: filter tags"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
    osmium tags-filter --overwrite --output=${OSM_FILTERED_FILE} --expressions ${OSM_FILTER_EXPRESSIONS} ${OSM_REGIONS}
  else
    echo "🥐 💥SKIPPED with 'SKIP_FILTER=true'"
  fi

else
  echo "🥐 osmium: 🧨 file ${OSM_GERMANY} or ${OSM_FILTER_EXPRESSIONS} not found"
fi

echo "🥐 osmium: filter osm data – END"
echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
