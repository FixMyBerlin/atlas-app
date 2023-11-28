import { MapboxGeoJSONFeature } from 'mapbox-gl'
import {
  StoreCalculator,
  StoreFeaturesInspector,
} from '../../../mapStateInteraction/useMapStateInteraction'

export const extractHighlightFeatureIds = (
  features:
    | StoreFeaturesInspector['unfilteredInspectorFeatures']
    | StoreCalculator['calculatorAreasWithFeatures'][number]['features'],
  key: string | undefined,
) => {
  const highlightFeatureIds = features
    .map((f) => key && (f?.properties?.[key] as string | undefined))
    .filter(Boolean)
  return highlightFeatureIds
}
