#!/bin/bash

# Find all files that end with .test.lua recursively in the current directory
# and store their paths in the array "test_files"
test_files=($(find . -name "*.test.lua"))

# Loop through the array "test_files" and run each file with the "lua" command
for file in "${test_files[@]}"
do
    echo "Running lua $file"
    lua "$file"
done
