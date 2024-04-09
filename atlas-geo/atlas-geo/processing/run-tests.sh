#!/bin/bash
# Run all test inside docker.
# This file is used by `./run-tests.sh`

# Find all files that end with .test.lua recursively in the current directory and store their paths in the array "test_files"
test_files=($(find . -name "*.test.lua"))

# Loop through the array "test_files" and run each file with the "lua" command
for file in "${test_files[@]}"
do
    printf "\033[1m\033[7m Running lua %s \033[0m\n" "$file"
    lua "$file"
done
