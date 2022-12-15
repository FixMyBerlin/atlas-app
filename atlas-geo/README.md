<div align="center">
  <!-- <img src="src/images/" height="80" /> -->
  <h1 align="center"><a href="https://radverkehtsatlas.de">Radverkehrsatlas.de</a> — processing repository</h1>
  <h3><strong>(!)</strong> This project ist still in development</h3>
</div>

## About

This project handles the processing of geo data for [`tarmac-app`](https://github.com/FixMyBerlin/tarmac-app).
The data is selected and optimize to make planning of bicycle infrastructure easier.

`tarmac-geo` will download, filter and process OpenStreetMap (OSM) data in a PostgreSQL/PostGIS Database and make them available as vector tiles with `pg_tileserve`. In addition, we support verifying OSM objects in a separate database.

## Issues

Please use [`tarmac-app`](https://github.com/FixMyBerlin/tarmac-app/issues) to create issues for this repository.

## Production

### Server

- https://tiles.radverkehrsatlas.de/
- https://staging-tiles.radverkehrsatlas.de/

### Data update

- Data is updated once a week, every monday ([cron job definition](https://github.com/FixMyBerlin/tarmac-geo/blob/main/.github/workflows/generate-tiles.yml#L3-L6))
- Data can manually updates [via Github Actions ("Run workflow > from Branch: `main`")](https://github.com/FixMyBerlin/tarmac-geo/actions/workflows/generate-tiles.yml).

### Deployment

1. First https://github.com/FixMyBerlin/tarmac-geo/actions runs.
2. Then our Server IONOS builds the data. This take about 30 Min ATM.
3. Then https://tiles.radverkehrsatlas.de/ / https://staging-tiles.radverkehrsatlas.de/ has new data.

#### Skip CI Actions

ATM, the CI runs on every commit. To skip commits add `[skip actions]` to the commit message. This is a [default behaviour](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs) of Github Actions.

## 1️⃣ Setup

First create a `.env` file. You can use the `.env.example` file as a template.

```sh
docker compose up
# or
docker compose up -d

# With osm processing, which runs the "app" docker image with `ruh.sh`
docker compose --profile osm_processing up -d
```

This will create the docker container and run all scripts. One this is finished, you can use the pg_tileserve-vector-tile-preview at http://localhost:7800/ to look at the data.

> **Warning**
> You need to create the Postgis extension before first run of `app\`:
> `CREATE EXTENSION postgis;`

> **Note**
> We use a custom build for `postgis` in [db.Dockerfile] to support Apple ARM64

## 💪 Work

You can only rebuild and regenerate the whole system, for now. The workflow is…

1. Edit the files locally

2. Rebuild and restart everything

   ```sh
   docker compose --profile osm_processing build && docker compose --profile osm_processing up
   ```

   The default `/docker-compose.yml` does set `SKIP_DOWNLOAD` and `SKIP_FILTER`. For your first run, you need to remove those.

3. Inspect the new results

> **Note**
> Learn more about the file/folder-structure and coding patterns in [`app/process/README.md`](/app/process/README.md)

**Notes**

Hack into the bash

```sh
docker compose exec app bash
```

You can also run the script locally:

1. This requires a new user in postgres which is the same as your current user:
   ```sh
   sudo -u postgres createuser --superuser $USER; sudo -u postgres createdb $USER
   ```
2. Then copy the [configuration file](https://www.postgresql.org/docs/current/libpq-pgservice.html) `./config/pg_service.conf` to `~/.pg_service.conf` and adapt your username and remove the password.

**Build & Run only one container**
Build docker

```sh
docker build -f app.Dockerfile -t tarmac:latest .
```

Run it

```sh
docker run --name mypipeline -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d tarmac
```

Hack into the bash

```sh
docker exec -it mypipeline bash
```

## 💛 Thanks to

This repo is highly inspired by and is containing code from [gislars/osm-parking-processing](https://github.com/gislars/osm-parking-processing/tree/wip)
