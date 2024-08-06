<div align="center">
  <!-- <img src="src/images/" height="80" /> -->
  <h1 align="center"><a href="https://radverkehrsatlas.de/">radverkehrsatlas.de</a> (Beta)</h1>
</div>

# About

**Radverkehrsatlas** provides access to **bicycle infrastructure** data from [**OpenStreetMap** (OSM)](https://www.openstreetmap.org) for administrative staff. The OSM data is processed and visualized in multiple map views. The integrated verification process provided a way for administrations to check the given data and provide feedback – internally and to the community. Based on this data, administrations can plan new bike lanes and networks and maintain existing infrastrucutre.

The backend, for processing and storing the geographic data, is located at [atlas-geo](https://github.com/FixMyBerlin/atlas-geo).

# Frontend

## Develop

- Framework: [NextJS](https://nextjs.org/) with [BlitzJS](https://blitzjs.com/)
- ORM: [Prisma](https://blitzjs.com/docs/cli-prisma)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

For VS Code we [recommended](.vscode/extensions.json) some extensions.

To test the login, you need to setup your own OSM OAuth 2-Application, see [osm-auth](https://github.com/osmlab/osm-auth#registering-an-application) and use [update the credentials](/.env.example).

### Testing the production bundle

1. Make sure `npm run dev` works as expected. This will make sure all packages are patched.
2. Create a `.env.production.local` with settings linke
   ```
   NEXT_PUBLIC_APP_ORIGIN=http://127.0.0.1:3000
   NEXT_PUBLIC_APP_ENV='staging' # 'staging', 'production'
   ```
3. Run `npm run build` and `npm run start` to test the production bundle

### NextJS tips

- Favicons:
  `icon.svg` https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
  Generator for `favicon.ico` https://realfavicongenerator.net/

## Helper scripts

All helper scripts run with [bun](https://bun.sh/).

### Update mapbox styles

See [/scripts/MapboxStyles/README.md](./scripts/MapboxStyles/README.md) on how to fetch updated style definitions from Mapbox.

### Update regional masks

See [/scripts/RegionalMasks/README.md](./scripts/RegionalMasks/README.md) on how to fetch updated the regional mask data.

### Update datasets

See [/datasets/README.md](./datasets/README.md) on how to process and update external datasets.

## Contribute

If you find any bugs, feel free to open an issue in this repository.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for more information.
It contains dependencies which have different Licenses, see [`package.json`](./package.json).

## Thanks

For the current version:

- Thank you [BlitzJS](https://blitzjs.com/) and [NextJS](https://nextjs.org/)
- Thank you [next-usequerystate](https://github.com/47ng/next-usequerystate/)
- Thank you [Tailwind CSS](https://tailwindcss.com/), [Tailwind UI](https://tailwindui.com/) and [Headless UI](https://headlessui.com/)

For the alpha version:

- Thank you [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
- Thank you [React Location](https://github.com/TanStack/router)

# Processing

## About

This project handles the processing of geo data for [`atlas-app`](https://github.com/FixMyBerlin/atlas-app).
The data is selected and optimize to make planning of bicycle infrastructure easier.

`atlas-geo` will download, filter and process OpenStreetMap (OSM) data in a PostgreSQL/PostGIS Database and make them available as vector tiles with [`martin`](https://github.com/maplibre/martin).

## Server

- Production Tiles https://tiles.radverkehrsatlas.de/
- Staging Tiles https://staging-tiles.radverkehrsatlas.de/
- Development Tiles http://localhost:7800/

## Data

### Freshness of source data

We use the [public Germany export from Geofabrik](https://download.geofabrik.de/europe/germany.html) `<3` which includes OSM Data up until ~20:00 h of the previous day. All processing is done on this dataset.

### Freshness of processed data

- Data is processed every day ([cron job definition](/.github/workflows/generate-tiles.yml#L3-L6))
- Data is processed on every deploy/release
- Data can be processed manually [via Github Actions ("Run workflow > from Branch: `main`")](https://github.com/FixMyBerlin/atlas-geo/actions/workflows/generate-tiles.yml).

### Deployment

1. First https://github.com/FixMyBerlin/atlas-app/actions runs.
2. Server (IONOS) runs the processing one table at a time.
   The whole processing takes about 1.5 h. See [`run.sh`](processing/run.sh) for details.

**Skip CI Actions:**

ATM, the CI runs on every commit. To skip commits add `[skip actions]` to the commit message. This is a [default behaviour](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs) of Github Actions.

## Development

### Initial setup

1. First create a `.env` file. You can use the `.env.example` file as a template.
2. Follow "Run the whole system"

### Run the whole system

The workflow is…

1. Edit the files locally

2. Rebuild and restart everything

   ```sh
   docker compose build && docker compose up
   ```

3. Inspect the new results, see "Inspect changes"

> **Note**
> Learn more about the file/folder-structure and coding patterns in [`processing/topics/README.md`](/processing/topics/README.md)

### Processing: Run changes only

Whenever `SKIP_DOWNLOAD=1` is active we store a hash of all `.lua` and `.sql` per folder.
During [`run-5-process.sh`](processing/run-5-process.sh) we only run code if the hash has changed.
If any helper in (`topics/helper`)[processing/topics/helper] changed, we rerun everything.

Whenever we talk about `hash`es in this code, this feature is referenced.

#### Force rerun

Whenever you need to force a rerun, open [any lua helper](./processing/topics/helper/Set.lua) and add a temporary code comment, save and restart the processing. Use the helper `run-full.sh` to do this automatically.

### Processing: Inspect changes

Whenever `SKIP_DOWNLOAD=1` and `COMPUTE_DIFFS=1`, the system will create `<tablename>_diff` tables that contain only changed entries.

It will compare the `tags` column to the previous run.

Whenever we talk about `diff`s in this code, this feature is referenced.

#### Reference

- With `FREEZE_DATA=0` you see the changes to the last run on every run
- With `FREEZE_DATA=1` you see the changes to the last reference-run, allowing you to compare your changes to a certain version of your data. The reference will be the last time you ran with `FREEZE_DATA=0`. In this case the system will **not** update the `<tablename>_diff` tables. This flag will be ignored if `COMPUTE_DIFFS=0`.

Use `run-full.sh` to toggle `FREEZE_DATA` and force a full rerun for a fresh reference.

#### `age` diffs

If `age` diffs show up, you need to create a fresh reference run of all the data.
You may use `run-full.sh` to set `FREEZE_DATA=0` and modify the helper folder to trigger a full rerun.

### Process only a single object

For the development process it's often usefull to run the processing on a single object.
For that you can specify an id (list) as `ID_FILTER` in the [`processing/run-3-filter.sh`](/processing/run-3-filter.sh).
See the [osmium-docs](https://docs.osmcode.org/osmium/latest/osmium-getid.html) for more information.

## 💛 Thanks to

The first iteration of iteration of this repo was inspired by [gislars/osm-parking-processing](https://github.com/gislars/osm-parking-processing)
