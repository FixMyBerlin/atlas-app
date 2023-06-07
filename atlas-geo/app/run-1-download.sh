#!/bin/sh
set -e

OSM_DATADIR="/data/" # needs to be root (in docker)
OSM_LOCAL_FILE=${OSM_DATADIR}openstreetmap-latest.osm.pbf

# OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
# OSM_DOWNLOAD_FILE=berlin-latest.osm.pbf
OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany-latest.osm.pbf
OSM_DOWNLOAD_FILE=germany-latest.osm.pbf


start_time=$(date +%s)
echo "\e[1m\e[7m DOWNLOAD – START \e[27m\e[21m – Start Time: $(date)"

if [ "$SKIP_DOWNLOAD" = "skip" ]; then
  echo "💥 SKIPPED with 'SKIP_DOWNLOAD=skip' in '/docker-compose.yml'"
else
  echo "File: ${OSM_DOWNLOAD_URL}"
  # Note: Showing the progress (locally) does not work, unfortunately
  wget --timestamping ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}
  cp ${OSM_DATADIR}${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo "\e[1m\e[7m DOWNLOAD – END \e[27m\e[21m – End Time: $(date), took $diff seconds"
