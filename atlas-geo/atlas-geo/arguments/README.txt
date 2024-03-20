It's not possible to pass arguments to "docker restart".
This folder exists to create the file "wait-for-fresh-data" to signal "run-1-wait-for-fresh-data.sh" to run "run-1-wait-for-fresh-data.js"
"run-1-wait-for-fresh-data.js" should only run if started by "docker restart app" from ".github/workflows/generate-tiles.yml"
