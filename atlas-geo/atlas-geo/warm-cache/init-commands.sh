#!/usr/bin/env zsh

log=/tmp/warm.log

echo "\$log = \"$log\""
alias warm='./warmCache.js | tee "$log"'
alias filter='./filterLog.ts --skip-info --skip-errors "$log"'
alias sort='./sortLog.ts "$log"'

download() {
  geojson=$(./download-tile.sh $1)
  echo "\$geojson = \"$geojson\""
}

analyze() {
  if [ -z "${geojson+1}" ]; then
    echo Please download a tile first or set \$geojson manually.
  else
    ./analyzeTile.ts $geojson "$@"
  fi
}

echo Added commands warm, filter, sort, download and analyze. Use -h for help.
