import { ThemeConfig } from '@components/MapInterface/mapStateConfig'
import {
  mapData,
  TopicIds,
  TopicStyleFilterIds,
  TopicStyleIds,
} from '../mapData.const'
import { SourcesIds } from '../sourcesMapData'
import { MapDataTopic } from '../types'

export const getTopicData = (topicId: TopicIds | undefined) => {
  return mapData?.topics.find((t) => t.id === topicId)
}

export const getThemeTopicData = (
  currentTheme: ThemeConfig | undefined,
  topicId: TopicIds | undefined
) => {
  if (!currentTheme?.topics.some((t) => t.id === topicId)) {
    return undefined
  }
  return mapData?.topics.find((t) => t.id === topicId)
}

export const getStyleData = (
  topicInput: TopicIds | MapDataTopic | undefined,
  styleId: TopicStyleIds | undefined
) => {
  if (typeof topicInput === 'string') {
    const topic = getTopicData(topicInput)
    return topic?.styles.find((s) => s.id === styleId)
  } else {
    return topicInput?.styles.find((s) => s.id === styleId)
  }
}

export const getFilterData = (
  topicId: TopicIds | undefined,
  styleId: TopicStyleIds | undefined,
  filterId: TopicStyleFilterIds | undefined
) => {
  const topic = getTopicData(topicId)
  const style = getStyleData(topic, styleId)
  return style?.interactiveFilters?.find((f) => f.id === filterId)
}

export const getSourceData = (sourceId: SourcesIds | undefined) => {
  return mapData?.sources?.find((s) => s.id === sourceId)
}
