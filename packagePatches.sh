#!/bin/bash

# The line you're adding
line='"./core/*": "./core/*.js",'

# The file you're modifying
file='node_modules/next-auth/package.json'

# Check if the line already exists in the file
if grep -Fxq "$line" "$file"; then
  echo "packagePatch.sh: The file has already been patched."
  exit 0
fi

# Apply the patch
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS (BSD sed)
  sed -i '' -e $'34i\\\n\\"./core/*\\": \\"./core/*.js\\",' "$file"
else
  # Linux (GNU sed)
  sed -i '34i\\"./core/*\\": \\"./core/*.js\\",' "$file"
fi
