import { ThemeConfig } from '@components/MapInterface/mapStateConfig'
import invariant from 'tiny-invariant'
import {
  mapData,
  TopicIds,
  TopicStyleFilterIds,
  TopicStyleIds,
} from '../mapData.const'
import { SourcesIds } from '../sourcesMapData'
import { MapDataThemeIds, themes } from '../themesMapData'
import { MapDataTopic } from '../types'

export const getThemeData = (themeId: MapDataThemeIds | undefined) => {
  const themeData = themes.find((the) => the.id === themeId)
  invariant(themeData, 'getThemeData: themeData required')
  return themeData
}

export const getTopicData = (topicId: TopicIds | undefined) => {
  const topicData = mapData?.topics.find((t) => t.id === topicId)
  invariant(topicData, `getTopicData: topicData for ${topicId} missing`)
  return topicData
}

export const getThemeTopicData = (
  currentTheme: ThemeConfig | undefined,
  topicId: TopicIds | undefined
) => {
  const isTopicInCurTheme = currentTheme?.topics.some((t) => t.id === topicId)
  invariant(
    isTopicInCurTheme,
    `topic ${topicId} has to be part of current theme`
  )

  const topicData = getTopicData(topicId)
  return topicData
}

export const getStyleData = (
  topicInput: TopicIds | MapDataTopic | undefined,
  styleId: TopicStyleIds | undefined
) => {
  let styleData = undefined
  if (typeof topicInput === 'string') {
    const topicData = getTopicData(topicInput)
    styleData = topicData?.styles.find((s) => s.id === styleId)
  } else {
    styleData = topicInput?.styles.find((s) => s.id === styleId)
  }
  invariant(styleData, `getStyleData: styleData for ${styleId} missing`)
  return styleData
}

export const getFilterData = (
  topicId: TopicIds | undefined,
  styleId: TopicStyleIds | undefined,
  filterId: TopicStyleFilterIds | undefined
) => {
  const topicD = getTopicData(topicId)
  const styleD = getStyleData(topicD, styleId)
  const filterData = styleD?.interactiveFilters?.find((f) => f.id === filterId)
  invariant(filterData, `getFilterData: filterData for ${filterId} missing`)
  return filterData
}

export const getSourceData = (sourceId: SourcesIds | undefined) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `filterData: sourceData for ${sourceId} missing`)
  return sourceData
}
