#!/usr/bin/env zsh

logfile=/tmp/warm.log
tiles_folder=tiles

warm() {
  case $1 in -h|--help)
    ./warmCache.js -h
    return
  ;; esac
  ./warmCache.js | tee "$logfile" && backup-log
}

alias filter='./filterLog.ts --skip-info --skip-errors "$logfile"'
alias sort='./sortLog.ts "$logfile"'
alias visualize='./visualizeLog.ts "$logfile" "geojson/warm.geojson"'

download() {
  mkdir -p $tiles_folder
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

_copy() {
  src=$1
  dst=$2
  if test -f "$src"; then
    cmd="cp $src $dst"
    echo $cmd
    eval $cmd
    else
      echo "File $src does not exist."
  fi
}

backup-log() {
  case $1 in -h|--help)
    echo "Creates a backup of \"$logfile.\""
    return
  ;; esac
  _copy $logfile $logfile.backup
}

restore-log() {
  case $1 in -h|--help)
    echo "Restores \"$logfile\" from backup."
    return
  ;; esac
  _copy $logfile.backup $logfile
}

write-log() {
  case $1 in -h|--help)
    echo "Writes to logfile \"$logfile\"."
    echo "Example call:"
    echo "  filter --grep='\/roads\/(10|9)\/' | sort -d | write-log"
    echo "  filter"
    return
  ;; esac
  local tmp=$logfile~
  rm -f $logfile~
  while read -r data; do
      echo "$data"
      echo "$data" >> $tmp
  done
  mv $tmp $logfile
  echo "Written to \"$logfile\"."
}

echo Added variables
echo "  * logfile=\"$logfile\""
echo "  * tiles_folder=\"$tiles_folder\""
cat <<'END'

Added commands
  * warm
  * backup-log
  * restore-log
  * write-log
  * filter
  * sort
  * download
  * analyze
  * visualize

Use -h, --help for additional information for each command.
END
