# About

We store most of our custom styles in Mapbox Studio:
https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/#13.49/48.95568/9.13281

The reason for that is, that styling the data there has the best editor experience. At the same time, we do not want to use Mapbox direclty for privacy reasons but also due to our own vector tiles setup.

## General process

1. Style in Mapbox Studio.
1. Publish the style in Mapbox Studio (only then the API output is updated).
1. Run `npm run updateStyles`.
   We use [Vite-Node](https://www.npmjs.com/package/vite-node) to run this script.
   This way we stay close to vite and vitest and it allows using imports and TS.
1. Check the generated files and update the `mapData` if needed.
   Including the source-attribute (see below).

## What does it do…

- Request the current styles from Mapbox studio via the Mapbox styles API
  (The raw output is in `./tmp` for debugging.)
- Filter the data to layerGroups that start with `atlas_`
- Cleanup the layer data to remove 'source', 'source-layer', 'metadata'; we need to add the sources as again as part of our 'mapData' config
- Generate types for layer Ids indie the same folder.
  One type with all Ids, one type for each topic of layers ("atlas_lit", "atlas_lit_complete", etc.)
- Create a new file `.json` inside our `/src/components/…` folder:

```json
[
  {
    "group": "atlas_lit",
    "layers": [
      /* Cleaned layer objects */
    ]
  }
]
```
