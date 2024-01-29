# Documentation

Create a file of all line segments >15m that are part of the input file but not part of "bikelanes_verified" from radverkehrsatlas.

Input file: `datasets/geojson/bb-land-radverkehrsanlagen.geojson`

## QGIS

1. _Export_ `bikelanes` as epsg25833
2. _Buffer_ `bikelanes` with 5m (10m Querschnitt)
3. Use _Difference_ to create a layer of only those segments of the **input** that are not part of `bikelanes`
   This creats multilinestrings for some geometries, which we need to split up. But we cannot use _Explode_, because that would split connected lines as well.
4. Use _Multiparts to singleparts_ to create separate the multilinestrings
5. Add length to segments:
   1. Open attribute table
   2. Click edit (mode)
   3. Click "Field calculator" (Icon)
   4. Create field `SEGMENT_LENGTH`
   5. Write "Expression" `$length`
6. Remove lines <15m
   1. Use _Extract by Expression_
   2. `"SEGMENT_LENGTH">=15`
7. _Export_ as `bb-land-radverkehrsanlagen-missing-in-osm` with geometry precision of 8 and geojson-default projection

Thank to ChatGPT 3.5 for helping with this steps.
