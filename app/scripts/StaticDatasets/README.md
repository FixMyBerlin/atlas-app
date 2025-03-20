# Static Datasets

These scripts manage geodata files, which are made public or semi-public in tilda-geo.de as static datasets.

## Setup

- Setup `./.env.development` based on [`./.env.development.example`](/./.env.development.example)
- [Install Bun](https://bun.sh/docs/installation)
  - macOS `brew tap oven-sh/bun && brew install bun`
  - Archlinux `yay -S bun-bin`
- [Install felt/tippecanoe](https://github.com/felt/tippecanoe/blob/main/README.md#installation)
  - macOS `brew install tippecanoe`
  - Archlinux `yay -S tippecanoe`
- Setup [`atlas-static-data`](https://github.com/FixMyBerlin/atlas-static-data), see README.

## Update and add data

1. `S3_UPLOAD_FOLDER` and `API_ROOT_URL`
   in [`/.env`](/.env)
   to be set to the right environment
2. Add file to `./geojson/region-<mainRegionSlug>`
   - Region-Subfolders are `region-<mainRegionSlug>` where the shorthand is usually the region slug. Whenever we have multiple regions like with `bb`, we use the "main slug" as folder name.
   - Dataset-Folders follow the pattern `<mainRegionSlug>-<customDatasetSlug>-<optionalDatasetSharedIdentiefier>`
   - GeoJson-Files can have any unique name (without spaces).
3. Run `npm run updateStaticDatasets`
   - Run `bun ./scripts/StaticDatasets/updateStaticDatasets.ts --keep-tmp --folder-filter bb-` to run all files where the Dataset-Folder includes "bb-".

### Temporary files

Themporary files are stored at `scripts/StaticDatasets/_geojson_temp` and deleted after each run.
Use `--keep-tmp` to keep the files for debugging.

### Skipping files

- All folders prefixed with `_` are skipped
- All files or folders specified in `app/scripts/StaticDatasets/geojson/.updateignore` are skipped

### Using compressed `.geojson.gz` Files

- In general we store the plain `.geojson` to have nice versioning and easy access to the contents
- When files are too big to store in Gihtub, we GZip them by hand
  ```
  gzip -f -9 …speeds.geojson
  ```
- The files are uncompressed and stored in the temp folder, then transformed, then processed (tippacanoe)

## How it works

This is what the script does…

1. Read the input GeoJSON (uncompress if needed) and run the transform.ts if present
2. Run tippecanoe and create the PMTiles file
3. Upload the PMTile to a protected folder on S3 inside the Dataset-Folder (no region subfolders)
4. Delete and create the database relation to connect this file to the region(s)

## Delete existing database entries

The script will **not remove existing database configs** if the dataset folder was rename or removed.

Use `npm run deleteAllStaticDatasets && npm run updateStaticDatasets` to reset all database entries.
