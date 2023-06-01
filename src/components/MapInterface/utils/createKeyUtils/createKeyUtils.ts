import { MapboxGeoJSONFeature } from 'react-map-gl'
import { TopicIds, TopicStyleFilterIds, TopicStyleIds, TopicStyleLegendIds } from '../../mapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
  TopicStyleLegendKey,
} from './types'

export const createTopicStyleKey = (topicId: TopicIds, styleId: TopicStyleIds): TopicStyleKey =>
  `${topicId}-${styleId}`

export const createTopicStyleFilterKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  filterId: TopicStyleFilterIds
): TopicStyleFilterKey => `${topicId}-${styleId}-${filterId}`

export const createTopicStyleLegendKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  legendId: TopicStyleLegendIds
): TopicStyleLegendKey => `${topicId}-${styleId}-${legendId}`

export const createTopicStyleFilterOptionKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  filterId: TopicStyleFilterIds,
  optionId: string
): TopicStyleFilterOptionKey => `${topicId}-${styleId}-${filterId}-${optionId}`

export const createSourceTopicStyleLayerKey = (
  sourceId: string,
  topicId: string,
  styleId: string,
  layerId: string
) => {
  return `${sourceId}--${topicId}--${styleId}--${layerId}`
}

export const createDatasetSourceLayerKey = (sourceId: string, layerId: string) => {
  return `${sourceId}--${layerId}`
}

export const createInspectorFeatureKey = (feature: MapboxGeoJSONFeature) => {
  // TODO, this has a static set of IDs which are defined on `sourceData.inspector.highlightingKey`
  // Ideally we would pick the value form sourceData, but that does not work for sourceDatasets
  return `${feature.layer.source}-${
    feature?.properties?.id || feature?.properties?.area_id || feature?.properties?.osm_id
  }`
}
