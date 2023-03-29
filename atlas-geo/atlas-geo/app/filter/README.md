# Sources

All `.poly` files in `./regions` are used in `run-2-filter.sh` to reduce the pbf file of Germany to only those regions we are supporting right now.
Docs: https://docs.osmcode.org/osmium/latest/osmium-extract.html

We switched from `.geojson` to `.poly` because joining two poly files is trivial (just concat the files) and thus allows a single run extract which is significantly faster.
Docs: https://wiki.openstreetmap.org/wiki/Osmosis/Polygon_Filter_File_Format

To convert `.geojson` files to the `.poly` format we use the command line tool [geojson2poly](https://www.npmjs.com/package/geojson2poly):

```
cd app/filter/regions
npx geojson2poly ./geojson/rs8.geojson rs8.poly
```

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
- https://app.placemark.io/play simplify
