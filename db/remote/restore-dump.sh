#!/usr/bin/env zsh

set -e

DIR=$( cd -P -- "$(dirname -- "$(command -v -- "$0")")" && pwd -P )
ls $DIR/data/dump.sql > /dev/null

alias psql="docker exec -i db psql -U postgres"

psql < $DIR/sql/pre-restore.sql
psql < $DIR/data/dump.sql
psql < $DIR/sql/post-restore.sql
blitz prisma migrate deploy
