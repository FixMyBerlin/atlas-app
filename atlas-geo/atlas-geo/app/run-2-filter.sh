#!/bin/bash
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql

FILTER_DIR="./filter/"

OSM_FILTER_EXPRESSIONS=${FILTER_DIR}filter-expressions.txt
OSM_INTERMEDIATE_FILE=${FILTER_DIR}intermediate.pbf

start_time=$(date +%s)
echo -e "\e[1m\e[7m FILTER – START \e[27m\e[21m – Start Time: $(date)\e[0m"

if [ $SKIP_TAG_FILTER == 1 ]; then
  echo "💥 SKIPPED tag filter with .env 'SKIP_TAG_FILTER=1'"
  mv ${OSM_LOCAL_FILE} ${OSM_FILTERED_FILE}
else
  # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
  osmium tags-filter --overwrite --expressions ${OSM_FILTER_EXPRESSIONS} --output=${OSM_FILTERED_FILE} ${OSM_LOCAL_FILE}
fi

if [ "$ID_FILTER" != "" ]; then
  echo -e "\e[1m\e[7m FILTER BY osm-id ${ID_FILTER}\e[27m\e[21m\e[0m"
  osmium getid --overwrite --output=${OSM_INTERMEDIATE_FILE} --verbose-ids ${OSM_FILTERED_FILE} ${ID_FILTER}
  mv ${OSM_INTERMEDIATE_FILE} ${OSM_FILTERED_FILE}
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo -e "\e[1m\e[7m FILTER – END \e[27m\e[21m – End Time: $(date), took $diff seconds\e[0m"
