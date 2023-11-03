import { MapboxGeoJSONFeature } from 'mapbox-gl'
import {
  StoreCalculator,
  StoreFeaturesInspector,
} from '../../../mapStateInteraction/useMapStateInteraction'

export const extractHighlightFeatureIds = (
  features:
    | StoreFeaturesInspector['inspectorFeatures']
    | StoreCalculator['calculatorAreasWithFeatures'][number]['features'],
  key: string | undefined,
) => {
  const highlightFeatureIds = features
    .map((f) => key && f?.properties?.[key])
    .filter((entry): entry is string => !!entry)
  return highlightFeatureIds
}
