# About

> [!NOTE]
> This script and process can only be used by FixMyBerlin employees.

We store most of our custom styles in Mapbox Studio:
https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/#13.49/48.95568/9.13281

The reason for that is, that styling the data there has the best editor experience. At the same time, we do not want to use Mapbox direclty for privacy reasons but also due to our own vector tiles setup.

## Initial Setup

1. Create a `.env.development.local` based on `.env.example`.
2. Install [Bun](https://bun.sh/docs/installation) which we use to run our scripts.

## General process

1. Use Mapbox Studio to style our custom data.
   - See [`npm run updateTilesets`](scripts/MapboxTilesets/README.md) on how to update the Data in Mapbox Studio
2. _Publish_ the style in Mapbox Studio (only then the API output is updated).
3. Run `npm run updateStyles`.
4. Check the generated files and update subcategory data as needed

## What it does

1. The script generates one style file per Mapbox folder in `src/app/regionen/[regionSlug]/_mapData/mapDataSubcategories/mapboxStyles/groups/`.
   - Only Mapbox folders that are prefixed with the term given in `mapboxGroupPrefix` (eg. `atlas_`) are processed.
   - The styles are cleaned up by removing 'source', 'source-layer', 'metadata' which we add back later in our subcategory configuration.
2. The script generates a merged sprite file in `public/map/`
3. The script stores the original base style in `src/app/api/map/style.json`.
   The `style.json` represents our `baseMapStyle`.
   The `style.ts` API is where we replace the sprite reference with our own.
