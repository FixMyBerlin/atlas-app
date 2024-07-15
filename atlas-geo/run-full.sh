#!/bin/bash
# Helper to start a full run of all files

# Append the current datetime to processing/topics/helper/._trigger-full-run-helper.lua
if [ ! -f processing/topics/helper/._trigger-full-run-helper.lua ]; then
  touch processing/topics/helper/._trigger-full-run-helper.lua
fi
infoline="This file is not a lua script. It is modified by \`./run-full.sh\` to change the folder hash and trigger a full re-run. You may ignore it or delete this file."
echo "-- $(date): $infoline" >> processing/topics/helper/._trigger-full-run-helper.lua

# Read the .env file and print the value for FREEZE_DATA
FREEZE_DATA=$(grep -o '^FREEZE_DATA=[0-9]*' .env | cut -d '=' -f 2 | cut -d ' ' -f 1)
if [ "$FREEZE_DATA" == "0" ]; then
  echo "FREEZE_DATA is 0 so this will become the reference run."
elif [ "$FREEZE_DATA" == "1" ]; then
  echo "FREEZE_DATA is 1 so this full run will be diffed on the last run."
fi

read -p "Toggle FREEZE_DATA? [Y/n] " -n 1 -r
echo    # move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # If yes, then toggle FREEZE_DATA and restart the script
  FREEZE_DATA=$(grep -o '^FREEZE_DATA=[0-9]*' .env | cut -d '=' -f 2 | cut -d ' ' -f 1)
  if [ "$FREEZE_DATA" == "0" ]; then
    sed -i '' 's/^FREEZE_DATA=0 /FREEZE_DATA=1 /' .env
  elif [ "$FREEZE_DATA" == "1" ]; then
    sed -i '' 's/^FREEZE_DATA=1 /FREEZE_DATA=0 /' .env
  fi
  exec "$0"
fi

# Ask if continue yes (Y) or no (n), any key should be yes
read -p "Continue with \`docker compose up\`? [Y/n] " -n 1 -r
echo # move to a new line
if [[ $REPLY =~ ^[Nn]$ ]]
then
  exit 1
# If yes, or any other key is pressed, then run "docker compose up"
# elif [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]
elif [[ $REPLY =~ ^[Yy]$ ]]
then
  docker compose up
fi
