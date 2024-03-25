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
    case $1 in -h|--help) ;; *)
      echo Please download a tile first or set \$geojson manually.
      return 0
    ;; esac
  fi
  ./analyzeTile.ts $geojson "$@"
}

echo Added commands warm, filter, sort, download and analyze. Use -h for help.
