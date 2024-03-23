import { StoreFeaturesInspector } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'

export const createInspectorFeatureKey = (
  feature: StoreFeaturesInspector['unfilteredInspectorFeatures'][number],
) => {
  // TODO, this has a static set of IDs which are defined on `sourceData.inspector.highlightingKey`
  // Ideally we would pick the value form sourceData, but that does not work for sourceDatasets
  return `${feature.source}-${
    feature?.properties?.id || feature?.properties?.area_id || feature?.properties?.osm_id
  }`
}
