const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");

const inputDir = path.join(__dirname, "regions");
const outputFile = path.join(__dirname, "regions_merged.geojson");

// Loop through each GeoJSON file in the input directory
fs.readdir(inputDir, (err, filenames) => {
  if (err) throw err;

  const geojsonFiles = filenames.filter(
    (file) => path.extname(file) === ".geojson"
  );

  if (!geojsonFiles.length) {
    console.error("No GeoJSON files", geojsonFiles);
  }

  const logMergedFiles = [];

  // Create an array of parsed GeoJSON objects
  const geojsons = [];
  geojsonFiles.forEach((file) => {
    const fileContent = fs.readFileSync(path.join(inputDir, file));
    const parsedContent = JSON.parse(fileContent.toString());

    // Add properties.filename so we can use this for debugging below
    if (parsedContent.type === "Feature") {
      parsedContent.properties.filename = file;
    } else if (parsedContent.type === "FeatureCollection") {
      parsedContent.features.forEach((feature) => {
        feature.properties.filename = file;
      });
    }

    geojsons.push(parsedContent);
  });

  const firstFeature =
    geojsons[0].type === "Feature" ? geojsons[0] : geojsons[0].features[0];
  let merged = firstFeature;
  logMergedFiles.push(firstFeature.properties.filename);

  geojsons.forEach((geojson) => {
    if (geojson.type === "Feature") {
      // Feature
      // NOTE: Turf 6.5 uses poly1, poly2. Turf 7 will allow uniont(turf.FeatureCollection([pol1...polyN]))
      merged = turf.union(merged, geojson);
      logMergedFiles.push(geojson.properties.filename);
    } else {
      // FeatureCollection
      geojson.features.forEach((feature) => {
        merged = turf.union(merged, feature);
        logMergedFiles.push(feature.properties.filename);
      });
    }
  });

  merged.properties.logMergedFiles = logMergedFiles.join(";");

  fs.writeFileSync(outputFile, JSON.stringify(merged));
});
