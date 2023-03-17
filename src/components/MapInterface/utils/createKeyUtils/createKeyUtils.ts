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
