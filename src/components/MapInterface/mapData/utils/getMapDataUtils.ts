import {
  mapData,
  TopicIds,
  TopicStyleFilterIds,
  TopicStyleIds,
} from '../mapDataConfig.const'
import { SourcesIds } from '../sourcesMapDataConfig'
import { MapDataTopic } from '../types'

export const getMapDataTopic = (topicId: TopicIds) => {
  return mapData.topics.find((t) => t.id === topicId)
}

export const getMapDataTopicStyle = (
  topicInput: TopicIds | MapDataTopic,
  styleId: TopicStyleIds
) => {
  if (typeof topicInput === 'string') {
    const topic = mapData.topics.find((t) => t.id === topicInput)
    return topic?.styles.find((s) => s.id === styleId)
  } else {
    return topicInput?.styles.find((s) => s.id === styleId)
  }
}

export const getMapDataTopicFilter = (
  topicId: TopicIds,
  styleId: TopicStyleIds,
  filterId: TopicStyleFilterIds
) => {
  const topic = mapData.topics.find((t) => t.id === topicId)
  const style = topic?.styles.find((s) => s.id === styleId)
  return style?.interactiveFilters?.find((f) => f.id === filterId)
}

export const getMapDataSource = (sourceId: SourcesIds | undefined) => {
  return mapData?.sources?.find((s) => s.id === sourceId)
}
