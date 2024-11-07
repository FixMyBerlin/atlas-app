#!/bin/bash
# Start docker and run all tests there.

docker compose run --rm --no-deps --name processing-tests --entrypoint "busted /processing/topics/ -p %.test%.lua$" processing
