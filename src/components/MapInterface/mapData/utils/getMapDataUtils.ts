import invariant from 'tiny-invariant'
import { mapData, TopicIds, TopicStyleFilterIds, TopicStyleIds } from '../mapData.const'
import { sourcesDatasets, SourcesDatasetsIds, SourcesIds } from '../sourcesMapData'
import { MapDataThemeIds, themes } from '../themesMapData'
import { MapDataStyle, MapDataTopic } from '../types'

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

export const getStyleData = (
  topicInput: TopicIds | MapDataTopic | undefined,
  styleId: TopicStyleIds | undefined
) => {
  let styleData = undefined
  if (typeof topicInput === 'string') {
    const topicData = getTopicData(topicInput)
    styleData = topicData?.styles.find((s) => s.id === styleId) as MapDataStyle // TODO improve types, likely changing the if-statement to something like "if 'id' in topicInput" to make it easier for TS to infer the types; we should also try to remove the 'undefined' more ore lesse everwhere
  } else {
    styleData = topicInput?.styles.find((s: MapDataStyle) => s.id === styleId) as MapDataStyle
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

export const getSourceData = (sourceId: SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  invariant(sourceData, `getSourceData: sourceData for ${sourceId} missing`)
  return sourceData
}

export const getDatasetOrSourceData = (sourceId: SourcesDatasetsIds | SourcesIds) => {
  const sourceData = mapData?.sources?.find((s) => s.id === sourceId)
  const datasetData = sourcesDatasets?.find((s) => s.id === sourceId)
  return sourceData || datasetData
}
