# Static Datasets

These scripts manage geodata files, which are made public or semi-public in radverkehrsatlas.de as static datasets.

## Setup

- Setup `.env.development.local` based on [`.env.example`](/.env.example)
- [Install Bun](https://bun.sh/docs/installation)
  - macOS `brew tap oven-sh/bun && brew install bun`
  - Archlinux `yay -S bun-bin`
- [Install felt/tippecanoe](https://github.com/felt/tippecanoe/blob/main/README.md#installation)
  - macOS `brew install tippecanoe`
  - Archlinux `yay -S tippecanoe`
- Setup [`atlas-static-data`](https://github.com/FixMyBerlin/atlas-static-data), see README.

## Update and add data

1. `S3_UPLOAD_FOLDER` and `API_ROOT_URL`
   in [`.env.development.local`](/.env.development.local)
   to be set to the right environment
2. Add file to `./geojson`
   - Naming requirements `<region>-<region>-<slug>.geojson`
3. Run `npm run updateStaticDatasets`

## How it works

- The script will run tippecanoe for every GeoJSIONM and create a temporary PMTiles file
- It will then upload this file to a protected folder on S3
- And create the database relation to connect this file to the region(s)
