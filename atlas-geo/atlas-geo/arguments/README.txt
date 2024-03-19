It's not possible to pass arguments to "docker restart".
This folder exists to create the file "wait-for-new-osm-data" to signal "run-0-wait-for-new-osm-data.sh" to run "run-0-wait-for-new-osm-data.js"
"run-0-wait-for-new-osm-data.js" should only run if started by "docker restart app" from ".github/workflows/generate-tiles.yml"
