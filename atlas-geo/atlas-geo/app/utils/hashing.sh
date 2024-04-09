#!/bin/bash

# (private function used by check_hash and update_hash)
hash_dir() {
  directory=$1
  suffix=$2
  echo $(find "$1" -type f -name "*$suffix" | sort | xargs shasum)
}

# (private function used by check_hash and update_hash)
hash_filename() {
  directory=$1
  suffix=$2
  echo $CODE_HASHES$(basename $directory)$suffix.sha
}

check_hash() {
  directory=$1
  suffix=$2
  file=$(hash_filename $directory $suffix)
  if [ -f "${file}" ]; then
    hash=$(hash_dir $directory $suffix)
    previous_hash=$(cat $file)
    if [ "$previous_hash" == "$hash" ]; then
      return 0
    fi
  fi
  return 1
}

update_hash() {
  directory=$1
  suffix=$2
  file=$(hash_filename $directory $suffix)
  hash_dir $directory $suffix > $file
}
