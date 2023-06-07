const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const file = path.join(__dirname, "regions_merged.geojson");

const fileContent = fs.readFileSync(file);

exec(
  `open "http://geojson.io/#data=data:application/json,${encodeURIComponent(
    fileContent.toString()
  )}"`
);
