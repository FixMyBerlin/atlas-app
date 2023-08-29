import { MapboxGeoJSONFeature } from 'react-map-gl'
// We use `MapboxGeoJSONFeature` here, since the `MapLayerMouseEvent` on onClick etc on the map returns this kind of type.

/** @desc Get two sets of arrays of GeoJSONFeatures and make sure they are unique by comparing their IDs */
export const uniqueGeoJSONFeatureArray = (
  existingFeatures: MapboxGeoJSONFeature[],
  featuresToAdd: MapboxGeoJSONFeature[],
) => {
  // We consider a fixed set of IDs for our comparison
  // TODO: Am I overthinking this? It might be enough to just check for `properties.id`. Which is what we do for `removeFromCalculator`.
  const getId = (p: MapboxGeoJSONFeature['properties']) =>
    [p?.id, p?.['@id'], p?.osm_tye, p?.osm_id, p?.way_id].filter(Boolean).join('-')

  const existingIds = existingFeatures.map((f) => getId(f.properties))

  const newFeatures = featuresToAdd.filter((f) => !existingIds.includes(getId(f.properties)))

  return [...existingFeatures, ...newFeatures]
}
