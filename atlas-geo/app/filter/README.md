# About

- Add a geojson file per region. All data inside this area will be processed.
- Run `npm run mergeRegions` to update [`regions_merged.geojson`](./regions_merged.geojson).
  - Use `npm run mergedRegions:preview` to look at the result on geojson.io
- Note: This process needs to be done manually and locally.
  (It does not run automatically as part of the docker process.)

# Sources

## Berlin Ring

- https://hanshack.com/geotools/gimmegeodata/
- https://www.openstreetmap.org/relation/11905744
- `properties` manually cleaned

## Berlin

- https://hanshack.com/geotools/gimmegeodata/
- https://www.openstreetmap.org/relation/62422
- Simplified with https://mapshaper.org/ and `5.7`%
- `tags` manually removed

# Langerwehe

- https://hanshack.com/geotools/gimmegeodata/
- https://www.openstreetmap.org/relation/162550
- Simplified with https://mapshaper.org/ and `27.9`%

# RS 8

- Gemarkungsgrenzen RS 8, Simplfied with Placemark Play, Merged with Placemark Play
- One piece of the bottom right polygon was removed because it was not relevant for the RS 8 route.

# Mainz

- https://www.openstreetmap.org/relation/62630
- https://hanshack.com/geotools/gimmegeodata/
- https://app.placemark.io/play => Simplify

# Landkreis Lüneburg

- https://www.openstreetmap.org/relation/2084746
- https://app.placemark.io/play => Simplify

# Amt Neukloster-Warin

- https://www.openstreetmap.org/relation/1515757
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 1km, Simplify

# Amt Landhagen

- https://www.openstreetmap.org/relation/1432580
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 1km, Simplify, Add Greifswald

# Amt Woldegk

- https://www.openstreetmap.org/relation/1419902
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 10km / Details 5

# Ostalbkreis

- https://www.openstreetmap.org/relation/62708
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 10km, Simplify

# Sigmaringen

- https://www.openstreetmap.org/relation/2806390
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 10km / Details 5

# Nagold

- https://www.openstreetmap.org/relation/2946978 (Stadtgebiet wäre https://www.openstreetmap.org/relation/1177445#map=12/48.5435/8.7226)
- https://hanshack.com/geotools/gimmegeodata/ => Download
- https://app.placemark.io/play => Buffer 10km / Details 5
