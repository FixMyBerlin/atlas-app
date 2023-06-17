#!/bin/bash
set -e

OSM2PGSQL_BIN=/usr/bin/osm2pgsql
ID_FILTER="" # See README.md 'Process only a single object'

FILTER_DIR="./filter/"
OSM_DATADIR="/data/" # root for docker

OSM_GERMANY=${OSM_DATADIR}openstreetmap-latest.osm.pbf
OSM_REGIONS=${OSM_DATADIR}openstreetmap-regions.osm.pbf
OSM_FILTERED_FILE=${OSM_DATADIR}openstreetmap-filtered.osm.pbf

OSM_FILTER_EXPRESSIONS=${FILTER_DIR}filter-expressions.txt
MERGED_REGIONS_FILE=${FILTER_DIR}regions_merged.geojson

start_time=$(date +%s)
echo -e "\e[1m\e[7m FILTER – START \e[27m\e[21m – Start Time: $(date)\e[0m"

if [ -f "${OSM_GERMANY}" ]; then

  if [ "$SKIP_FILTER" = "skip" ]; then
    echo "💥 SKIPPED with 'SKIP_FILTER=skip' in '/docker-compose.yml'"
  else
    region_start_time=$(date +%s)
    echo -e "\e[1m\e[7m FILTER REGIONS – START \e[27m\e[21m\e[0m"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-extract.html
    # osmium extract --overwrite --polygon=${MERGED_REGIONS_FILE} --output=${OSM_REGIONS} ${OSM_GERMANY}
    region_end_time=$(date +%s)
    region_diff=$((region_start_time - region_end_time))
    echo -e "\e[1m\e[7m FILTER REGIONS – END \e[27m\e[21m took $region_diff seconds\e[0m"

    tags_start_time=$(date +%s)
    echo -e "\e[1m\e[7m FILTER TAGS – START \e[27m\e[21m\e[0m"
    # Docs https://docs.osmcode.org/osmium/latest/osmium-tags-filter.html
    osmium tags-filter --overwrite --expressions ${OSM_FILTER_EXPRESSIONS} --output=${OSM_FILTERED_FILE} ${OSM_GERMANY}
    tags_end_time=$(date +%s)
    tags_diff=$((tags_start_time - tags_end_time))
    echo -e "\e[1m\e[7m FILTER TAGS – END \e[27m\e[21m took $tags_diff seconds\e[0m"
  fi
  if [ "$ID_FILTER" != "" ]; then
    echo -e "\e[1m\e[7m FILTER BY osm-id ${ID_FILTER}\e[27m\e[21m\e[0m"
    osmium getid --overwrite --output=${OSM_FILTERED_FILE} --verbose-ids ${OSM_FILTERED_FILE} ${ID_FILTER}
  fi
else
  echo "Filter: 🧨 file ${OSM_GERMANY} not found"
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo -e "\e[1m\e[7m FILTER – END \e[27m\e[21m – End Time: $(date), took $diff seconds\e[0m"
