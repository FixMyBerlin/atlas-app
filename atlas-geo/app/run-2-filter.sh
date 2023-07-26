#!/bin/bash
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql
ID_FILTER="" # See README.md 'Process only a single object'

FILTER_DIR="./filter/"

OSM_FILTER_EXPRESSIONS=${FILTER_DIR}filter-expressions.txt
MERGED_REGIONS_FILE=${FILTER_DIR}regions_merged.geojson

start_time=$(date +%s)
echo -e "\e[1m\e[7m FILTER – START \e[27m\e[21m – Start Time: $(date)\e[0m"

if [ $SKIP_TAG_FILTER == 1 ]; then
  echo "💥 SKIPPED tag filter with .env 'SKIP_TAG_FILTER=1'"
  ln -f ${OSM_LOCAL_FILE} ${OSM_FILTERED_FILE}
else
  tags_start_time=$(date +%s)
  echo -e "\e[1m\e[7m FILTER TAGS – START \e[27m\e[21m\e[0m"
  # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
  osmium tags-filter --overwrite --expressions ${OSM_FILTER_EXPRESSIONS} --output=${OSM_FILTERED_FILE} ${OSM_LOCAL_FILE}
  tags_end_time=$(date +%s)
  tags_diff=$((tags_start_time - tags_end_time))
  echo -e "\e[1m\e[7m FILTER TAGS – END \e[27m\e[21m took $tags_diff seconds\e[0m"
fi

if [ "$ID_FILTER" != "" ]; then
  echo -e "\e[1m\e[7m FILTER BY osm-id ${ID_FILTER}\e[27m\e[21m\e[0m"
  osmium getid --overwrite --output=${OSM_FILTERED_FILE} --verbose-ids ${OSM_FILTERED_FILE} ${ID_FILTER}
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo -e "\e[1m\e[7m FILTER – END \e[27m\e[21m – End Time: $(date), took $diff seconds\e[0m"
