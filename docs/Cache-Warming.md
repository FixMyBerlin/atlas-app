# Cache Warming

We use nginx as proxy, which helps us caching the tiles, which are produced by Martin Tile Server. In [run-7-warm-cache.sh](processing/run-7-warm-cache.sh), we remove the cache, when fresh data was processed. Since the tileserver is producing the tiles on-the-fly from a PostgreSQL database, this would result in a high load on first loads. We don't want user to encounter that situation. Therefore, the script executes a [script](/app/src/app/api/private/warm-cache/warmCache.ts), which calculates tiles which are most used and are at a low-level zoom and therefore have to calculate a lot of data.

The config at [warm-cache.json](/configs/warm-cache.json) configures, which layers to use for warm-caching and which map boundaries.
