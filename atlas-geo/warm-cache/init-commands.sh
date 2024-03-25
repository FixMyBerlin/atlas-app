#!/usr/bin/env zsh

log_file=/tmp/warm.log
tiles_folder=tiles

alias warm='./warmCache.js | tee "$log_file"'
alias filter='./filterLog.ts --skip-info --skip-errors "$log_file"'
alias sort='./sortLog.ts "$log_file"'

download() {
  mkdir -p tiles_folder
  geojson=$(./downloadTile.js $1 $tiles_folder)
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

echo \$log_file="'$log_file'"
echo \tiles_folder="'tiles_folder'"
echo Added commands warm, filter, sort, download and analyze. Use -h for help.
