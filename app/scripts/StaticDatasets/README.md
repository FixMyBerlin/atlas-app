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
2. Add file to `./geojson/region-<mainRegionSlug>`
   - Region-Subfolders are `region-<mainRegionSlug>` where the shorthand is usually the region slug. Whenever we have multiple regions like with `bb`, we use the "main slug" as folder name.
   - Dataset-Folders follow the pattern `<mainRegionSlug>-<customDatasetSlug>-<optionalDatasetSharedIdentiefier>`
   - GeoJson-Files can have any unique name (without spaces).
     It has to be unique because ATM this is the name the temp geojson files and the pmtiles get inside the flat temp folder.
   - All folders prefixed with `_` are skipped.
3. Run `npm run updateStaticDatasets`
   - Run `bun ./scripts/StaticDatasets/updateStaticDatasets.ts --keep-tmp --folder-filter bb-` to run all files where the Dataset-Folder includes "bb-".

## How it works

This is what the script does…

1. Read the input GeoJSON and run the transform.ts if present
1. Run tippecanoe and create a temporary PMTiles file
1. Upload the PMTile to a protected folder on S3 inside the Dataset-Folder (no region subfolders)
1. Delete and create the database relation to connect this file to the region(s)

The script will **not remove existing database configs** if the dataset folder was rename or removed. Use `npm run deleteAllStaticDatasets && npm run updateStaticDatasets` to reset all database entries.
