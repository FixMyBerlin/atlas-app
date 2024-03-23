#!/usr/bin/env zsh

log=/tmp/warm.log
tile="\$tile-will-be-set-by-download"

echo "\$log = \"$log\""
alias warm='./warmCache.js | tee "$log"'
alias filter='./filterLog.ts --skip-info --skip-errors "$log"'
alias sort='./sortLog.ts "$log"'
alias analyze='./analyzeTile.ts'

download() {
  tile=$(./download-tile.sh $1)
  echo "\$tile = \"$tile\""
}

which warm
which filter
which sort
which analyze
which download
