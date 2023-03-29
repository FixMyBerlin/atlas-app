# Dataset `maxspeed`

Classifies all road elements that have a/no maximum speed, or all road elements to which a maximum speed could be assigned due to political requirements.

For all lines that do not have a maximum speed (not even via the source tags), the table "landuse" is buffered with 10 meters and then with the road elements. All road elements that lie within these areas/intersect are derived as maximum speed from land use ("maxspeed_source='inferred_from_landuse'", "\_todo="add 'maxspeed:source=DE:urban')

## Main values

- Docs: https://wiki.openstreetmap.org/wiki/Key:maxspeed

## Notes about the `maxspeed` Tag in OpenStreetMap (OSM)

In general, maxspeed data is not tagged well in OSM.
One reasons is, that the data is not visible at all, so no one sees missing data or tagging mistages.

There are sevaral approaches we looked into to process `maxspeed` data:

### Approach 1: Just take "maxspeed"

Just take the explicitly tagged data. Rely on the community to fill in the blanks.
That would work in time; however, OSM does not like tagging implict data. So tagging the whole city with "maxspeed=50" is bad practise.

#### Approach 2: Add source-Data to the mix.

Whenever the maxspeed is implicit, one could make this fact explicit by addin a source info.
Unfortunatelly there are multipe tagging schemas in use, which makes this complex…
However, we can use this data to derive maxspeed data for all roads with source-tagging.
Which is what I did for our proof of concept.
See https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/Highways-MaxspeedData/utils/addMaxspeedProperty.ts
I also add my own source-Tag to tell our user where the maxspeed value comes from.
See https://github.com/FixMyBerlin/osm-scripts/blob/main/utils/Highways-MaxspeedData/utils/addMaxspeedSourceProperty.ts

##### Approach 3: Library

After our proof of concept was done, Tobias Zwick released a new library, that does parts of what we did, but with a lot more detail. However, the main benefit of the library are very detailed maxsped values for bus and such… which we don't need.

- https://github.com/westnordost/osm-legal-default-speeds
- Demo https://westnordost.github.io/osm-legal-default-speeds/#tags=highway%3Dprimary&cc=DE
- FYI about why the `zone`-Schema is not needed https://github.com/westnordost/osm-legal-default-speeds/issues/4

We could use this library to fill in the blanks.
However, it is unclear how we would run the library code as part of our technical setup.
More about this at https://github.com/openstreetmap/osm2pgsql/discussions/1765.

However, the library does not solve the "source" information (yet), so that would be something we need to build ourself.
