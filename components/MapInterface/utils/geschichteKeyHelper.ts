import {
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleFilterIds,
  MapDataConfigTopicStyleIds,
} from '../Map/mapData'
import { TopicStyleFilterKey, TopicStyleKey } from '../store'

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

export const splitTopicStyleKey = (
  key: TopicStyleKey
): [MapDataConfigTopicIds, MapDataConfigTopicStyleIds] => {
  const [topicId, styleId] = key.split('-')
  return [
    topicId as MapDataConfigTopicIds,
    styleId as MapDataConfigTopicStyleIds,
  ]
}

export const splitTopicStyleFilterKey = (
  key: TopicStyleFilterKey
): [
  MapDataConfigTopicIds,
  MapDataConfigTopicStyleIds,
  MapDataConfigTopicStyleFilterIds
] => {
  const [topicId, styleId, filterId] = key.split('-')
  return [
    topicId as MapDataConfigTopicIds,
    styleId as MapDataConfigTopicStyleIds,
    filterId as MapDataConfigTopicStyleFilterIds,
  ]
}
