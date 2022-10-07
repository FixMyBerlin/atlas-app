import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from '../../mapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
} from './types'

export const createTopicStyleKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds
): TopicStyleKey => `${topicId}-${styleId}`

export const createTopicStyleFilterKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds,
  filterId: MapDataConfigTopicStyleFilterIds
): TopicStyleFilterKey => `${topicId}-${styleId}-${filterId}`

export const createTopicStyleFilterOptionKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds,
  filterId: MapDataConfigTopicStyleFilterIds,
  optionId: string
): TopicStyleFilterOptionKey => `${topicId}-${styleId}-${filterId}-${optionId}`
