#!/bin/bash
# Start docker and run all tests there.

docker compose run --no-deps --entrypoint "busted /processing/topics/ -p %.test%.lua$" processing
