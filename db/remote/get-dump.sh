#!/usr/bin/env zsh

set -e

usage() { echo "Usage: get-dump.sh [-s]" 1>&2; exit 1; }

while getopts 'sh' OPTION; do
  case "$OPTION" in
    s) USE_STAGING=1 ;;
    h) usage ;;
    ?) usage ;;
  esac
done

. ./.env
. ./.env.local
if [ $USE_STAGING ]; then
  if ! [ -v DATABASE_URL_STAGING ]; then
    echo 'DATABASE_URL_STAGING is not set.'
    exit 1
  else
    DATABASE_URL=$DATABASE_URL_STAGING
    echo "Getting dump from staging database..."
  fi
else
  if ! [ -v DATABASE_URL_PRODUCTION ]; then
    echo 'DATABASE_URL_PRODUCTION is not set.'
    exit 1
  else
    DATABASE_URL=$DATABASE_URL_PRODUCTION
    echo "Getting dump from production database..."
  fi
fi

DIR=$( cd -P -- "$(dirname -- "$(command -v -- "$0")")" && pwd -P )
alias pg_isready="docker run -it --rm --network host --entrypoint pg_isready postgres"

function try() {
  [[ $- = *e* ]]; SAVED_OPT_E=$?
  set +e
}

function catch()
{
    export ex_code=$?
    (( $SAVED_OPT_E )) && set +e
    return $ex_code
}

try
(
  pg_isready -d $DATABASE_URL
)
catch || {
  echo "Could not connect. Have you created the tunnel?"
  exit $1
}

echo "================================================================================"
alias pg_dump
echo "--schema=prisma"
echo "DATABASE_URL=$DATABASE_URL"
echo "================================================================================"

pg_dump --schema=prisma $DATABASE_URL \
  | sed 's/OWNER TO dbmasteruser;/OWNER TO postgres;/g' \
  | sed 's/OWNER TO devteam;/OWNER TO postgres;/g' \
  > $DIR/data/dump.sql

ls -l $DIR/data/dump.sql
