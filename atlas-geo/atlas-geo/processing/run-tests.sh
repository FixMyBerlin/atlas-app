#!/bin/bash
# Run all test inside docker.
# This file is used by `./run-tests.sh`

busted /processing/topics/ -p "%.test%.lua$"
