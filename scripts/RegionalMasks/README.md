# About

We process our data for all of Germany. But for our viewer, we want to have a mask and prominent border style that helps to focus on the given region.

- In regions.const.ts we store the OSM boundary relation IDs that belong to a given reagion
- The atlas-geo repository has an API that will pull those regions and merge connecting areas
- This script will pull all reagions, simplify them, create a buffer and mask it to the bbox of germany
- The resulting input.geojson is then transformed to an atlas-regional-masks.pmtiles
- We use our exisiting datasets pmtiles process to host and consume this file
- The map will filter the data for the given reagion
