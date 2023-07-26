#!/bin/bash
set -e

start_time=$(date +%s)
echo -e "\e[1m\e[7m DOWNLOAD – START \e[27m\e[21m – Start Time: $(date)\e[0m"

OSM_DOWNLOAD_FILE="${OSM_DATADIR}$(basename $OSM_DOWNLOAD_URL)"
if [ $SKIP_DOWNLOAD == 1 ]; then
  if [ -f "${OSM_DOWNLOAD_FILE}" ]; then
    echo "💥 SKIPPED with .env 'SKIP_DOWNLOAD=1'"
    exit 0;
  else
    echo "Can't skip download, no file was found."
  fi
fi
echo "Downloading file: ${OSM_DOWNLOAD_URL}"
# Note: Showing the progress (locally) does not work, unfortunately
if wget --timestamping ${OSM_DOWNLOAD_URL} --directory-prefix=${OSM_DATADIR}; then
  ln -f ${OSM_DOWNLOAD_FILE} ${OSM_LOCAL_FILE}
else
  echo "Error: Failed to download the file from ${OSM_DOWNLOAD_URL}"
fi

end_time=$(date +%s)
diff=$((end_time - start_time))
echo -e "\e[1m\e[7m DOWNLOAD – END \e[27m\e[21m – End Time: $(date), took $diff seconds\e[0m"
