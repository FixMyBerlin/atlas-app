#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS (BSD sed)
  sed -i '' -e $'34i\\\n\\"./core/*\\": \\"./core/*.js\\",' node_modules/next-auth/package.json
else
  # Linux (GNU sed)
  sed -i '34i\\"./core/*\\": \\"./core/*.js\\",' node_modules/next-auth/package.json
fi
