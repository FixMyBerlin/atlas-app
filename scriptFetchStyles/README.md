# Idea

- We use Mapbox Studio to style our data
  - https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/#13.49/48.95568/9.13281
- We use the Mapbox Style API to get the raw style
- We then cleanup the style to remove all Mapbox own styles; keeping only our own
- We use those style definitions inside our `<Layer>` defintions, by pulling them from this cleaned but generated style file

This way, the design of the style stays in Mapbox.
But our users never connect to Mapbox servers (privacy).
And we still have a modular Setup for all our Visualisation.

# Run

- TODO: Fix the `TODO_*.js` file which is supposed to downlaod and clean the style in one go.

For now (see above)…

1. Copy the styles from [`https://api.mapbox.com/styles/v1/hejco/cl706a84j003v14o23n2r81w7?access_token=${process.env.MAPBOX_STYLE_ACCESS_TOKEN}`](https://api.mapbox.com/styles/v1/hejco/cl706a84j003v14o23n2r81w7?access_token=)
2. Paste it in [`./output/tarmac-style-raw.json`](./output/tarmac-style-raw.json)
3. Run …
   ```
   node clean-style.js
   ```

# FYI Mapbox data IDs and their meaning

| data id        | desc                |
| -------------- | ------------------- |
| hejco.8gob9b0c | 10 km Radius        |
| hejco.8y5mjt9u | dimm layer          |
| hejco.9ca2gk6c | anschlusspunkte zes |
| hejco.8cpvm1l1 | netzkonzepte zes    |
| hejco.3hccfujx | OUR pois            |
| hejco.d7mywzd3 | OUR highways        |
