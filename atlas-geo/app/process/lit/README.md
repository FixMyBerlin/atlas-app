# Dataset `lit`

**OSM:**

- Docs: https://wiki.openstreetmap.org/wiki/Key:lit
  Note: the QA tools on https://wiki.openstreetmap.org/wiki/DE:Key:lit do not work for our use case or not at all.

## Main values

- `category` (string) – `list`, `unlit`, `special`
- `lit` (string) – Raw osm values

## Style helper tags

- `verified` (string) – The state of verification
- `is_present` (boolean) – Is the main data (lit) present? "Any lit values" is `true`, "no lit value" is `false`.
- `fresh` (string | "not present") – Was the main data (lit) checked at least 2 years ago? (based on `check_date:lit` or the object's timestamp) the string is of the form `<"fresh" | "outdated">_<"updated_at" | "check_date">` where the `"check_date"` indicates a higher confidence;
- `fresh_age_days` (number) – Age of data as number of days based on `check_date:lit`

## Raw OSM tags

(!) We might change those tags at any time.

- `access`
- `check_date:lit` – Testing https://overpass-turbo.eu/s/1lZW
- `footway`
- `highway`
- `is_sidepath`
- `name`
- `service`

## Processing helper

- `_skip`
- `_skipNotes`
