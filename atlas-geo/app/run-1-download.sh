#!/bin/sh
set -e

OSM_DATADIR="/data/" # needs to be root (in docker)
OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf

# OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
# OSM_DOWNLOAD_FILE=berlin-latest.osm.pbf
OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany-latest.osm.pbf
OSM_DOWNLOAD_FILE=germany-latest.osm.pbf

echo "🥐 Download ${OSM_DOWNLOAD_URL} – START"
# Docs https://www.man7.org/linux/man-pages/man1/wget.1.html
#  --quiet
wget --timestamping --show-progress ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}
cp ${OSM_DATADIR}${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
# echo "☝️💥 SKIPPED FOR DEV"

echo "🥐 Download ${OSM_DOWNLOAD_URL} – END"
