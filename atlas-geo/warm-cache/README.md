# About

…

## Run locally

1. Edit [`.env`](.env)
2. Run…

   ```
   cd ./warm-cache
   time node ./warmCache.js
   ```

## Debugging: Visualize Tiles as GeoJSON

```
$ cd atlas-geo/warm-cache
$ source init-commands.sh
$ warm
2024-04-04T09:59:47 ℹ Using config ./config.json
# …
$ visualize -h
Usage: visulizeLog [options] <logfile> <geojson>
Creates a <geojson> from <logfile> visualizing screen size, requests and responses
# …
$ visualize
Saved data to geojson/warm.geojson.
```
