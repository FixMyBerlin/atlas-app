# Dataset `lit``

## Main values

- `category` (string) – `list`, `unlit`, `special`
- `lit` (string) – Raw osm values

## Style helper tags

- `is_fresh` (boolean) – Was the main data (lit) checked at least 2 years ago? (based on `check_date:lit`)
- `is_present` (boolean) – Is the main data (lit) present? "Any lit values" is `true`, "no lit value" is `false`.
- `verified` (string) – The state of verification
- `fresh_age_days` (number) – Age of data as number of days based on `check_date:lit`

## Raw OSM tags

(!) We might change those tags at any time.

- `access`
- `check_date:lit`
- `footway`
- `highway`
- `is_sidepath`
- `name`
- `service`

## Processing helper

- `_skip`
- `_skipNotes`
