import { MapboxGeoJSONFeature } from 'react-map-gl'
import { TopicIds, TopicStyleIds, TopicStyleLegendIds } from '../../mapData/mapData.const'
import { TopicStyleKey, TopicStyleLegendKey } from './types'
import { StoreFeaturesInspector } from '../../mapStateInteraction/useMapStateInteraction'

export const createTopicStyleKey = (topicId: TopicIds, styleId: TopicStyleIds): TopicStyleKey =>
  `${topicId}-${styleId}`

export const createTopicStyleLegendKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  legendId: TopicStyleLegendIds,
): TopicStyleLegendKey => `${topicId}-${styleId}-${legendId}`

export const createSourceTopicStyleLayerKey = (
  sourceId: string,
  topicId: string,
  styleId: string,
  layerId: string,
) => {
  return `${sourceId}--${topicId}--${styleId}--${layerId}`
}

export const createSourceKey = (themeId: string, sourceId: string, topicId: string) => {
  return `theme:${themeId}--source:${sourceId}--topic:${topicId}`
}

export const createDatasetSourceLayerKey = (sourceId: string, layerId: string) => {
  return `${sourceId}--${layerId}`
}

export const createInspectorFeatureKey = (
  feature: StoreFeaturesInspector['inspectorFeatures'][number],
) => {
  // TODO, this has a static set of IDs which are defined on `sourceData.inspector.highlightingKey`
  // Ideally we would pick the value form sourceData, but that does not work for sourceDatasets
  return `${feature.source}-${
    feature?.properties?.id || feature?.properties?.area_id || feature?.properties?.osm_id
  }`
}