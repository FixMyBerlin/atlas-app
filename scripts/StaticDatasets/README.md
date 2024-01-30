# About

## Setup

- Setup `.env.development.local` based on [`.env.example`](/.env.example)
- [Install Bun](https://bun.sh/docs/installation) `brew tap oven-sh/bun && brew install bun`
- [Install tippecanoe](https://formulae.brew.sh/formula/tippecanoe) `brew install tippecanoe`

## Update and add data

1. `S3_PMTILES_FOLDER` and `API_ROOT_URL`
   in [`.env.development.local`](/.env.development.local)
   to be set to the right environment
2. Add file to `./geojson`
   - Naming requirements `<region>-<region>-<slug>.geojson`
3. Run `npm run updateStaticDatasets`

## How it works

- The script will run tippecanoe and create a temporary pmtiles file
- It will then upload this file to a protected folder on S3
- And create the database relation to connect this file to the region(s)
