#!/bin/sh
set -e

flags()
{
    while test $# -gt 0
    do
        case "$1" in
        --dev)
            export DEVELOP="1"
            ;;
        esac

        # and here we shift to the next argument
        shift
    done
}
flags "$@"

# TODO – Some variables are duplicated now, this can be cleaner I guess…
./run-1-download.sh
./run-2-filter.sh
./run-3-process.sh
