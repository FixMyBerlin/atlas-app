# About

We used to export GeoJson from the app and use that to add testing data to Mapbox Studio as Tilesets.
However, Mapbox Studio does weird things when processing GeoJson which breaks the data when zoomed out.

As a work around, we now create mbtiles and import those in Mapbox (manually).

Run

```
npm run updateTilesets
```

This command will open the browser tabs needed. Use "replace" and pick the generated mbtiles.

## Reminder

The files we create here are likely different that what our own tileserver creates.
We have to choose some optiones in tippecanoe to generate a file that works well in Mapbox accross zoom levels.
However the tippecanoe options that pick the maxzoom and make the decisions on what to drop per zoom level will likely not match what our tileserver does.
