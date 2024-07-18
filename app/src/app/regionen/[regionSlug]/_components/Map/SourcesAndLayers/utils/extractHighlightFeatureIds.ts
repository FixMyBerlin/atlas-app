import { MapboxGeoJSONFeature } from 'mapbox-gl'
import { StoreCalculator, StoreFeaturesInspector } from '../../../../_hooks/mapState/useMapState'

export const extractHighlightFeatureIds = (
  features:
    | StoreFeaturesInspector['inspectorFeatures']
    | StoreCalculator['calculatorAreasWithFeatures'][number]['features'],
  key: string | undefined,
) => {
  const highlightFeatureIds = features
    .map((f) => key && (f?.properties?.[key] as string | undefined))
    .filter(Boolean)
  return highlightFeatureIds
}
