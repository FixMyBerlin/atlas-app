#!/bin/bash
# Start docker and run all tests there.
# This file is used by `npm run test`

docker compose run --entrypoint "busted /processing/topics/ -p %.test%.lua$" processing
