import { TopicIds, TopicStyleFilterIds, TopicStyleIds } from '../../mapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
} from './types'

export const createTopicStyleKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds
): TopicStyleKey => `${topicId}-${styleId}`

export const createTopicStyleFilterKey = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  filterId: TopicStyleFilterIds
): TopicStyleFilterKey => `${topicId}-${styleId}-${filterId}`

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
