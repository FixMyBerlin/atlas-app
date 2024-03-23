#!/usr/bin/env zsh

set -e

if [ -z "$1" ]
  then
    echo "URL argument is missing."
    exit 1
fi

folder=tiles
mkdir -p tiles

filename=$(node -e "console.log(new URL('$1').pathname.slice(1).replaceAll('/', '-'))")
filepath=$folder/$filename
br=$filepath.mvt.br
mvt=$filepath.mvt
geojson=$filepath.geojson

if test -f "$geojson"; then
  >&2 echo "$geojson exists."
else
  curl $1 --output $br
  >&2 echo "$1 was downloaded to $br"
  brotli -dj $br
  >&2 echo "$br was decompressed to $mvt"
  ./convertTileToGeojson.ts $mvt $geojson
  >&2 echo "$mvt was converted to $geojson"
fi

echo $geojson
