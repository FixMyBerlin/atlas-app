#!/usr/bin/env zsh

set -e

if [ -z "$1" ]
  then
    echo "URL argument is missing."
    exit 1
fi

folder=tiles
mkdir -p tiles
name=$(node -e "console.log(new URL('$1').pathname.slice(1).replaceAll('/', '-'))")
if test -f "$folder/$name.mvt"; then
  >&2 echo "File $folder/$name.mvt exists."
else
  curl $1 --output $folder/$name.mvt.br
  brotli -d $folder/$name.mvt.br
  rm $folder/$name.mvt.br
  >&2 echo "Tile was saved to $folder/$name.mvt"
fi
echo $folder/$name.mvt
