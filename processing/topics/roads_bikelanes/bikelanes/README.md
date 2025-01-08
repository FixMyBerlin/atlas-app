# Dataset `bikelanes`

## `TODO`: document centerline processing

`TODO`

## Main values

> [!NOTICE]
> This file is not up to date!

- `category` (string)
  - `bicycleRoad` – Fahrradstraße based on tag OR traffic_sign
  - `cyclewayAlone` – "Frei geführte Radwege"; dedicated cycleways that are not next to a road; eg. https://www.openstreetmap.org/way/27701956
  - `cyclewaySeparated` – "Baulich abgesetzte Radwege" ("Protected Bike Lane"); Relies on `is_sidepath` tagging; eg. https://www.openstreetmap.org/way/278057274
  - `cyclewayOnHighway` – "Radfahrstreifen" / "Schutz- oder Angebotsstreifen"
  - `footAndCycleway_segregated` – "Getrennter Geh- und Radweg" (and Rad- und Gehweg) based on tagging OR traffic_sign
  - `footAndCycleway_shared` – "Gemeinsamer Geh- und Radweg" based on tagging OR traffic_sign
  - `footway_bicycleYes` – "Gehweg, Fahrrad frei"
  - `pedestrianArea_bicycleYes` – "Fußgängerzonen, Fahrrad frei" ("dismount" does count as "no")

## Style helper tags

- `verified` (string) – The state of verification
- `is_present` (boolean) – Is the main data (lit) present? "Any lit values" is `true`, "no lit value" is `false`.
- `is_fresh` (boolean) – Was the main data (lit) checked at least 2 years ago? (based on `check_date:lit`)
- `fresh_age_days` (number) – Age of data as number of days based on `check_date:lit`

## Raw OSM tags

(!) We might change those tags at any time.

- (Undocumented list of OSM tags…)
- `check_date:cycleway` – StreetComplete uses this value.
  - Example for default case on centerline: https://www.openstreetmap.org/way/318888127
  - Example for "separate", but check_date is only on the centerline: https://www.openstreetmap.org/way/79386000
  - Example for "no": https://www.openstreetmap.org/way/318210373
  - Overpass Query: https://overpass-turbo.eu/s/1nzk

## Processing helper

Those are prefixed with by an underscore `_*=*`.
