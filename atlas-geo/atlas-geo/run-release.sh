#!/bin/bash
# Create a new release pull request.

gh pr create --base main --head develop --title "Release $(date '+%Y-%m-%d')" --body ""
