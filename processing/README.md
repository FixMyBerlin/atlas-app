# `processing` README

## Monorepo

Please read the [README](../README.md) first.

## About

The processing downloads the OpenStreetMap (OSM) data, filters and processes it into a PostgreSQL/PostGIS database which are then made available as vector tiles with [`martin`](https://github.com/maplibre/martin).
The data gets selected and optimized to make planning of bicycle infrastructure easier.

## Freshness

### Freshness of source data

We use the [public Germany export from Geofabrik](https://download.geofabrik.de/europe/germany.html) which includes OSM Data up until ~20:00 h of the previous day. All processing is done on this dataset.

### Freshness of processed data

- Data is processed every day ([cron job definition](/.github/workflows/generate-tiles.yml#L3-L6))
- Data is processed on every deploy/release
- Data can be processed manually [via Github Actions ("Run workflow > from Branch: `main`")](https://github.com/FixMyBerlin/atlas-geo/actions/workflows/generate-tiles.yml).

## Preview

### Martin catalogue and preview

See https://github.com/FixMyBerlin/atlas-app/blob/develop/processing/run-5-process.sh#L45-L50 for a list URLs to see the data that Martin provides.

## Development

### Run the whole system

The workflow is…

1. Edit the files locally

2. Rebuild and restart everything

   Frist, make sure you are in the root folder of this repo.

   ```sh
   docker compose build && docker compose up
   ```

3. Inspect the new results, see "Inspect changes"

> **Note**
> Learn more about the file/folder-structure and coding patterns in [`processing/topics/README.md`](/processing/topics/README.md)

### Processing: Run changes only

With `SKIP_UNCHANGED=1` we compare the hashes of all `.lua` and `.sql` files to the last run per topic.
During [`run-5-process.sh`](processing/run-5-process.sh) we only run code if the respective hash has changed.
If any helper in (`topics/helper`)[processing/topics/helper] or the OSM file has changed, we rerun everything.

Whenever we talk about `hash`es in this code, this feature is referenced.

### Processing: Inspect changes

With `COMPUTE_DIFFS=1` the system will create `<tablename>_diff` tables that contain only changed entries.

It will compare the `tags` column to the previous run.

Whenever we talk about `diff`s in this code, this feature is referenced.

#### Reference

- With `FREEZE_DATA=0` you see the changes to the last run on every run
- With `FREEZE_DATA=1` you see the changes to the last reference-run, allowing you to compare your changes to a certain version of your data. The reference will be the last time you ran with `FREEZE_DATA=0`. In this case the system will **not** update the `backup.<tablename>` tables. This flag will be ignored if `COMPUTE_DIFFS=0`.

To run everything without code caching and diffing set `SKIP_UNCHANGED=0` and `COMPUTE_DIFFS=0`.

### Process only a single object

For the development process it's often useful to run the processing on a single object.
For that you can specify an id (list) as `ID_FILTER` in the [`processing/run-3-filter.sh`](/processing/run-3-filter.sh).
See the [osmium-docs](https://docs.osmcode.org/osmium/latest/osmium-getid.html) for more information.

## Tests

We use the luarocks package [busted](https://lunarmodules.github.io/busted/) as our testing framework.

### Run

To run the tests manually:

```
./processing/run-tests.sh
```

Additionally all tests are being run in the [husky](https://typicode.github.io/husky/) [pre-push](../app/.husky/pre-push) hook.

### Conventions

- Create one test file per helper
- Filename has to be `\*.test.lua`
- Place it in a `__tests__` folder next to the file

## Deployment

1. First https://github.com/FixMyBerlin/atlas-app/actions runs.
2. Server (IONOS) runs the processing one table at a time.
   The whole processing takes about 1.5 h.
   See [`run.sh`](./run.sh) for details.

# 💛 Thanks to

- Thank you [osm2pgsql](https://osm2pgsql.org/)
- Thank you [Geofabrik](https://download.geofabrik.de/)

The first iteration of the processing pipeline was inspired by [gislars/osm-parking-processing](https://github.com/gislars/osm-parking-processing)
