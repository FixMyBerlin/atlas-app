import { MapboxGeoJSONFeature } from 'mapbox-gl'

export const extractHighlightFeatureIds = (
  features: MapboxGeoJSONFeature[],
  key: string | undefined
) => {
  const highlightFeatureIds = features
    .map((f) => key && f?.properties?.[key])
    .filter((entry): entry is string => !!entry)
  return highlightFeatureIds
}
