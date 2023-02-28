# Dataset `maxspeed`

- Classifies all road elements that have a/no maximum speed, or all road elements to which a maximum speed could be assigned due to political requirements.
For all lines that do not have a maximum speed (not even via the source tags), the table "landuse" is buffered with 10 meters and then with the road elements. All road elements that lie within these areas/intersect are derived as maximum speed from land use ("maxspeed_source='infereed from landuse'", "_todo="add 'maxspeed:source=DE:urban')

## Main values

- Docs: https://wiki.openstreetmap.org/wiki/Key:maxspeed

## Style helper tags

- `verified` (string) – The state of verification
- `is_present` (boolean) – Is the main data (lit) present? "Any lit values" is `true`, "no lit value" is `false`.
- `is_fresh` (boolean) – Was the main data (lit) checked at least 2 years ago? (based on `check_date:lit`)
- `fresh_age_days` (number) – Age of data as number of days based on `check_date:lit`

_None_

## Raw OSM tags

(!) We might change those tags at any time.

> TODO

## Processing helper

_None_
