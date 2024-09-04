import { StoreFeaturesInspector } from '../../../_hooks/mapState/useMapState'

export const createInspectorFeatureKey = (
  feature: StoreFeaturesInspector['inspectorFeatures'][number],
) => `${feature.source}-${feature.id}`
