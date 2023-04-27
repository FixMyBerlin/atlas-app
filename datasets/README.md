# Static, external datasets

## About

This folder is used to store and document static, external datasets.

## a. Create and upload files

`npm run updateDatasets` will …

1. Create `./pmtiles/*.pmtiles` for all `./geojson/*.geojson` files using [Tippecanoe](https://github.com/felt/tippecanoe)

   - See [process.cjs](./process.cjs) for installation instruction on Tippecanoe

2. Upload those files to our AWS S3 bucket

   - See [upload.cjs](./upload.cjs) for installation instruction on AWS credentials
   - AWS S3 bucket: https://s3.console.aws.amazon.com/s3/buckets/atlas-tiles?region=eu-central-1&tab=objects
   - This step will output demo links in the console ([Example](https://protomaps.github.io/PMTiles/?url=https%3A%2F%2Fatlas-tiles.s3.eu-central-1.amazonaws.com%2FTrtoRadnetz.pmtiles#map=10.42/53.7228/13.2153))

3. Write dataset types and object

   - See [typesAndObject.cjs](./typesAndObject.cjs)

## b. Configure files

The `<SelectDataset>` component uses [sourcesDatasets.const.ts](../src/components/MapInterface/mapData/sourcesMapData/sourcesDatasets.const.ts) for all information on the dataset and the relation to a given region.
