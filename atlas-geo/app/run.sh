#!/bin/sh
set -e

# TODO – Some variables are duplicated now, this can be cleaner I guess…
./run-1-download.sh
./run-2-filter.sh
./run-3-cleanup.sh
./run-4-process.sh
./run-5-postprocess.sh
