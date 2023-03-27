# Dataset `roadClassification`

## Main values

`category` holds the value of the OSM `highway` tag … with a few exceptions:

- `highway=road` becomes `category=unspecified_road_category`
- `highway=service + service=*` becomes `category=service_unspecified`
- `highway=service + service=alley` becomes `category=service_alley`
- `highway=service + service=driveway` becomes `category=service_driveway`
- `highway=service + service=parking_aisle` becomes `category=service_parking_aisle`
- `highway=* + bicycle_road=yes` becomes `category=bicycle_road`
- `highway=steps` becomes `category=footway`
