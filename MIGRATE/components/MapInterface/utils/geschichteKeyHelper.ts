import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from '../Map/mapData'
import {
  TopicStyleFilterKey,
  TopicStyleFilterOptionKey,
  TopicStyleKey,
} from '../store'

export const createTopicStyleKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds
): TopicStyleKey => `${topicId}-${styleId}`

export const createTopicStyleFilterKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds,
  filterId: MapDataConfigTopicStyleFilterIds
): TopicStyleFilterKey | undefined =>
  filterId === '' ? undefined : `${topicId}-${styleId}-${filterId}`
export const createTopicStyleFilterOptionKey = (
  topicId: MapDataConfigTopicIds,
  styleId: MapDataConfigTopicStyleIds,
  filterId: MapDataConfigTopicStyleFilterIds,
  optionId: string
): TopicStyleFilterOptionKey | undefined =>
  filterId === '' ? undefined : `${topicId}-${styleId}-${filterId}-${optionId}`

export const splitTopicStyleKey = (
  key: TopicStyleKey
): [MapDataConfigTopicIds, MapDataConfigTopicStyleIds] => {
  const [topicId, styleId] = key.split('-')
  return [
    topicId as MapDataConfigTopicIds,
    styleId as MapDataConfigTopicStyleIds,
  ]
}

export const splitTopicStyleFilterOptionKey = (
  key: TopicStyleFilterOptionKey
): [
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
  MapDataConfigTopicStyleFilterIds,
  string
] => {
  const [topicId, styleId, filterId, optionId] = key.split('-')
  return [
    topicId as MapDataConfigTopicIds,
    styleId as MapDataConfigTopicStyleIds,
    filterId as MapDataConfigTopicStyleFilterIds,
    optionId as string,
  ]
}
