#!/bin/bash
set -e

# OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany/berlin-latest.osm.pbf
# OSM_DOWNLOAD_FILE=berlin-latest.osm.pbf
OSM_DOWNLOAD_URL=http://download.geofabrik.de/europe/germany-latest.osm.pbf
OSM_DOWNLOAD_FILE=germany-latest.osm.pbf

start_time=$(date +%s)
echo -e "\e[1m\e[7m DOWNLOAD – START \e[27m\e[21m – Start Time: $(date)\e[0m"

if [ $SKIP_DOWNLOAD == 1 ]; then
  if [ -f "${OSM_LOCAL_FILE}" ]; then 
    echo "💥 SKIPPED with 'SKIP_DOWNLOAD=1' in '/docker-compose.yml'"
    exit 0;
  else
    echo "Can't skip download, no file was found."
  fi
fi
echo "File: ${OSM_DOWNLOAD_URL}"
# Note: Showing the progress (locally) does not work, unfortunately
if wget --timestamping ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}; then
  cp ${OSM_DATADIR}${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
else
  echo "Error: Failed to download the file from ${OSM_DOWNLOAD_URL}"
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo -e "\e[1m\e[7m DOWNLOAD – END \e[27m\e[21m – End Time: $(date), took $diff seconds\e[0m"