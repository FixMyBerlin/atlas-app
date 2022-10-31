#!/bin/sh
set -e

OSM_DATADIR="/data/" # needs to be root (in docker)
OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf

# OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
# OSM_DOWNLOAD_FILE=berlin-latest.osm.pbf
OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany-latest.osm.pbf
OSM_DOWNLOAD_FILE=germany-latest.osm.pbf

echo "\e[1m\e[7m Download – START \e[27m\e[21m"

if [ "$SKIP_DOWNLOAD" = "true" ]; then
  # Docs https://www.man7.org/linux/man-pages/man1/wget.1.html
  # --show-progress  <--- helpfull when running locally
  echo "File: ${OSM_DOWNLOAD_URL}"
  wget --timestamping --quiet ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}
  cp ${OSM_DATADIR}${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
else
  echo "💥 SKIPPED with 'SKIP_DOWNLOAD=true'"
fi

echo "\e[1m\e[7m Download – END \e[27m\e[21m"
