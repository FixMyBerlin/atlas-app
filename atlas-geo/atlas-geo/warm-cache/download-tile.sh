#!/usr/bin/env bash

set -e

folder=tiles
mkdir -p tiles
name=$(node -e "console.log(new URL('$1').pathname.slice(1).replaceAll('/', '-'))")
curl $1 --output $folder/$name.mvt.br
brotli -d $folder/$name.mvt.br
rm $folder/$name.mvt.br
echo "Tile was saved to $folder/$name.mvt"
