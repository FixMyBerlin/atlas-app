# Coding conventions for `/process`

## Database

**Primary tables**

- `<NAME>` is the primary table, corresponding to a folder and file `/app/process/<NAME>/<NAME>.lua`.
- `<NAME>_verified` is the primary table for those datasets that have internal verification enabled.
  The `_verified` tables include the processed OSM data _and_ the verification information. The raw verification data is stored in `<NAME>_verification` and joined on the `_verified` table.
  In those cases, the `<NAME>` table is not used directly (it holds the processed OSM data only).

**Official helper tables**

- `<NAME>_excluded` holds objects that where filtered during processing. This table is useful (only) for debugging.

**Processing helper tables**

- `_<NAME>_<POSTFIX>` are helper tables that are used during processing. They are irrelevant for the final result.
- `_<NAME>_temp` are helper tables that make sure our `<NAME>_verified` setup does work. More at [`app/run-6-postprocess.sh`](/app/run-6-postprocess.sh)
- `<NAME>_verification` – see above

## osm2pgsql lua files

## helper

General helper functions that add functionality to lua. See [`./helper`](`./helper`) for more.

## shared

Shared helper functions are related to our data processing. See [`./shared`](`./shared`) for more.
